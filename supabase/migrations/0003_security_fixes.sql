-- move pg_trgm out of public
create schema if not exists extensions;
alter extension pg_trgm set schema extensions;
drop index if exists skaters_name_trgm_idx;
create index skaters_name_trgm_idx on skaters using gin ((given_name || ' ' || family_name) extensions.gin_trgm_ops);

-- views must run as the querying role (respect RLS), not the creator
alter view v_personal_records set (security_invoker = true);
alter view v_season_bests set (security_invoker = true);

-- materialized views can't set security_invoker or be safely exposed directly;
-- lock down the matview and expose it through an invoker view instead
revoke all on mv_adelskalender from anon, authenticated;
create view v_adelskalender as select * from mv_adelskalender;
alter view v_adelskalender set (security_invoker = true);
grant select on v_adelskalender to anon, authenticated;
