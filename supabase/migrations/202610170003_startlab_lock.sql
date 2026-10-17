-- [Claude, 2026-10-17] Apply after 202610170002. Not yet run against a real project.
-- The lock itself is Supabase Auth's ban (set by the Edge Function via the admin API);
-- locked_at mirrors it so the admin list can show the state without one request per account.
alter table public.profiles add column locked_at timestamptz;
-- No new grants: students still read only their own row (policy own_profile) and cannot update.
