-- [Codex, 2026-10-17] Apply after 0003. Validate the server-side session,
-- not only the access token expiry. No auth table is exposed through the API.
create function public.startlab_session_active(account_id uuid, session_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists (
  select 1 from auth.sessions s
  join auth.users u on u.id=s.user_id
  join public.profiles p on p.id=u.id
  where s.id=session_id and s.user_id=account_id
   and u.email_confirmed_at is not null
   and (u.banned_until is null or u.banned_until<=now())
   and p.locked_at is null
 );
$$;
revoke all on function public.startlab_session_active(uuid,uuid) from public,anon,authenticated;
grant execute on function public.startlab_session_active(uuid,uuid) to service_role;

-- A user may ask only whether their own JWT's session is active.
-- This also protects direct profile reads via PostgREST after sign-out/locking.
create function public.startlab_current_session_active()
returns boolean language sql stable security definer set search_path='' as $$
 select public.startlab_session_active(auth.uid(), (auth.jwt()->>'session_id')::uuid);
$$;
revoke all on function public.startlab_current_session_active() from public,anon;
grant execute on function public.startlab_current_session_active() to authenticated;
drop policy own_profile on public.profiles;
create policy own_profile on public.profiles for select to authenticated
 using ((select auth.uid())=id and (select public.startlab_current_session_active()));
