create function refresh_mv_adelskalender()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  refresh materialized view concurrently mv_adelskalender;
end;
$$;

revoke all on function refresh_mv_adelskalender() from public, anon, authenticated;
grant execute on function refresh_mv_adelskalender() to service_role;

-- required for REFRESH ... CONCURRENTLY
create unique index if not exists mv_adelskalender_unique_idx on mv_adelskalender (skater_id, kind, gender);
