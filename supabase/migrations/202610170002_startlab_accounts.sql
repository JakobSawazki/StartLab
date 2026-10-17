-- [Claude, 2026-10-17] Apply after 202610170001_startlab.sql. Not yet run against a real project.
-- 1. One Kürzel rule for database, Edge Function and website (content.js kuerzelMap).
-- 2. Profile e-mail follows the confirmed Auth e-mail, so Kürzel login and admin views stay current.
create function public.startlab_username_base(first_name text,last_name text) returns text
language sql immutable set search_path='' as $$
 select left(regexp_replace(translate(replace(replace(replace(replace(replace(replace(lower(normalize(trim(first_name),NFC)),'ä','ae'),'ö','oe'),'ü','ue'),'ß','ss'),'æ','ae'),'œ','oe'),'áàâãåāăąéèêëēėęěíìîïīįıóòôõøōőúùûūůűųýÿñńňçćčďđğłľĺřŕšśşťţžźż','aaaaaaaaeeeeeeeeiiiiiiiooooooouuuuuuuyynnncccddglllrrsssttzzz'),'[^a-z]','','g'),3)
 ||left(regexp_replace(translate(replace(replace(replace(replace(replace(replace(lower(normalize(trim(last_name),NFC)),'ä','ae'),'ö','oe'),'ü','ue'),'ß','ss'),'æ','ae'),'œ','oe'),'áàâãåāăąéèêëēėęěíìîïīįıóòôõøōőúùûūůűųýÿñńňçćčďđğłľĺřŕšśşťţžźż','aaaaaaaaeeeeeeeeiiiiiiiooooooouuuuuuuyynnncccddglllrrsssttzzz'),'[^a-z]','','g'),3)
$$;
revoke all on function public.startlab_username_base(text,text) from public,anon,authenticated;
create or replace function public.startlab_profile() returns trigger language plpgsql security definer set search_path='' as $$
declare f text; l text; base text; candidate text; suffix integer:=1;
begin
 f:=trim(new.raw_user_meta_data->>'first_name');l:=trim(new.raw_user_meta_data->>'last_name');
 if f is null or l is null or length(f) not between 1 and 60 or length(l) not between 1 and 60 or f ~ '[[:cntrl:]]' or l ~ '[[:cntrl:]]' then raise exception 'Invalid name';end if;
 base:=public.startlab_username_base(f,l);
 if length(base)<2 then raise exception 'Name needs supported letters';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(base));candidate:=base;
 while exists(select 1 from public.profiles where username=candidate) loop suffix:=suffix+1;candidate:=base||suffix;end loop;
 insert into public.profiles(id,username,first_name,last_name,email) values(new.id,candidate,f,l,new.email);
 return new;
end $$;
revoke all on function public.startlab_profile() from public,anon,authenticated;
create function public.startlab_sync_email() returns trigger language plpgsql security definer set search_path='' as $$
begin
 update public.profiles set email=new.email where id=new.id;
 return new;
end $$;
revoke all on function public.startlab_sync_email() from public,anon,authenticated;
create trigger startlab_email_changed after update of email on auth.users for each row
 when (new.email is not null and old.email is distinct from new.email) execute function public.startlab_sync_email();
