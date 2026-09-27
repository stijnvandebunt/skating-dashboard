-- personal records per skater/distance: fastest time_ms per (skater, distance)
create view v_personal_records as
select distinct on (r.skater_id, r.distance)
  r.skater_id, r.distance, r.gender, r.time_ms, r.time_raw, r.race_date,
  r.competition_id, r.track_id, r.ssr_link
from results r
order by r.skater_id, r.distance, r.time_ms asc;

-- season bests: fastest time_ms per (skater, distance, season)
create view v_season_bests as
select distinct on (r.skater_id, r.distance, r.season)
  r.skater_id, r.distance, r.season, r.gender, r.time_ms, r.time_raw, r.race_date,
  r.competition_id, r.track_id, r.ssr_link
from results r
order by r.skater_id, r.distance, r.season, r.time_ms asc;

-- Adelskalender: 500m-average per distance, truncated to 3 decimals, summed.
-- Classic combos only (no masters):
--   men:   500 / 1500 / 5000 / 10000
--   women: 500 / 1500 / 3000 / 5000
create materialized view mv_adelskalender as
with pr as (
  select skater_id, gender, distance, time_ms
  from v_personal_records
),
combo as (
  select 'classic'::text as kind, 'm'::char(1) as gender, array[500,1500,5000,10000] as distances
  union all
  select 'classic', 'f', array[500,1500,3000,5000]
),
required as (
  select c.kind, c.gender, unnest(c.distances) as distance
  from combo c
),
skater_combo as (
  select p.skater_id, r.kind, r.gender,
    count(*) as legs_found,
    array_length(
      (select distances from combo c where c.kind = r.kind and c.gender = r.gender), 1
    ) as legs_needed,
    sum(trunc((p.time_ms::numeric / 1000) / (p.distance::numeric / 500), 3)) as points
  from required r
  join pr p on p.gender = r.gender and p.distance = r.distance
  group by p.skater_id, r.kind, r.gender
)
select skater_id, kind, gender, points
from skater_combo
where legs_found = legs_needed;

create index mv_adelskalender_idx on mv_adelskalender (kind, gender, points);
