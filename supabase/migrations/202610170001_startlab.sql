-- Apply once to a new Supabase project. Personal records never enter Git.
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (username ~ '^[a-z]{2,6}[0-9]*$'),
 first_name text not null check (length(first_name) between 1 and 60),
 last_name text not null check (length(last_name) between 1 and 60),
 email text not null,
 created_at timestamptz not null default now()
);
create table public.administrators (user_id uuid primary key references auth.users(id) on delete cascade);
create table public.request_limits (bucket text primary key,window_start timestamptz not null,hits integer not null);
create table public.admin_audit (id bigint generated always as identity primary key,actor uuid references auth.users(id) on delete set null,target uuid references auth.users(id) on delete set null,action text not null,created_at timestamptz not null default now());
alter table public.profiles enable row level security;
alter table public.administrators enable row level security;
alter table public.request_limits enable row level security;
alter table public.admin_audit enable row level security;
revoke all on public.profiles,public.administrators,public.request_limits,public.admin_audit from anon,authenticated;
grant select on public.profiles to authenticated;
create policy own_profile on public.profiles for select to authenticated using ((select auth.uid())=id);
-- Only the Edge Function service role can list profiles, manage roles or audit.
grant all on public.profiles,public.administrators,public.request_limits,public.admin_audit to service_role;
grant usage,select on sequence public.admin_audit_id_seq to service_role;
create function public.startlab_profile() returns trigger language plpgsql security definer set search_path='' as $$
declare f text; l text; base text; candidate text; suffix integer:=1;
begin
 f:=trim(new.raw_user_meta_data->>'first_name');l:=trim(new.raw_user_meta_data->>'last_name');
 if f is null or l is null or length(f) not between 1 and 60 or length(l) not between 1 and 60 then raise exception 'Invalid name';end if;
 base:=left(regexp_replace(translate(replace(replace(replace(replace(lower(f),'ä','ae'),'ö','oe'),'ü','ue'),'ß','ss'),'áàâéèêëíìîïóòôúùûñç','aaaeeeeiiiiooouuunc'),'[^a-z]','','g'),3)
 ||left(regexp_replace(translate(replace(replace(replace(replace(lower(l),'ä','ae'),'ö','oe'),'ü','ue'),'ß','ss'),'áàâéèêëíìîïóòôúùûñç','aaaeeeeiiiiooouuunc'),'[^a-z]','','g'),3);
 if length(base)<2 then raise exception 'Name needs supported letters';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(base));candidate:=base;
 while exists(select 1 from public.profiles where username=candidate) loop suffix:=suffix+1;candidate:=base||suffix;end loop;
 insert into public.profiles(id,username,first_name,last_name,email) values(new.id,candidate,f,l,new.email);
 return new;
end $$;
revoke all on function public.startlab_profile() from public,anon,authenticated;
create trigger startlab_new_user after insert on auth.users for each row execute function public.startlab_profile();
create function public.startlab_limit(key text,maximum integer) returns boolean language plpgsql security definer set search_path='' as $$
declare current_hits integer;
begin
 -- Bound retention; buckets contain hashes, never emails, passwords or IPs.
 delete from public.request_limits where window_start<now()-interval '1 day';
 insert into public.request_limits(bucket,window_start,hits) values(key,now(),1)
 on conflict(bucket) do update set hits=case when request_limits.window_start<now()-interval '15 minutes' then 1 else request_limits.hits+1 end,
 window_start=case when request_limits.window_start<now()-interval '15 minutes' then now() else request_limits.window_start end
 returning hits into current_hits;
 return current_hits<=maximum;
end $$;
revoke all on function public.startlab_limit(text,integer) from public,anon,authenticated;
grant execute on function public.startlab_limit(text,integer) to service_role;
