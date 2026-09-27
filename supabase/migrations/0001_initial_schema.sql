create extension if not exists pg_trgm;

create table tracks (
  id integer primary key,               -- SSR track id
  name text not null,
  city text,
  country char(3) not null,
  altitude_m integer,
  indoor boolean not null default false,
  created_at timestamptz not null default now()
);

create table skaters (
  id bigint primary key,                -- SSR skater id
  slug text not null unique,
  given_name text not null,
  family_name text not null,
  country char(3) not null,
  gender char(1) not null check (gender in ('m', 'f')),
  birthdate date,
  category text,                        -- e.g. Senior, Junior, Neo-Senior, Youth (never Masters)
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);
create index skaters_name_trgm_idx on skaters using gin ((given_name || ' ' || family_name) gin_trgm_ops);
create index skaters_country_idx on skaters (country);

create table competitions (
  id bigint primary key,                -- SSR competition id
  name text not null,
  track_id integer references tracks(id),
  start_date date not null,
  end_date date,
  season integer not null,              -- season start year, e.g. 2024 = 2024/2025
  ssr_link text,
  created_at timestamptz not null default now()
);
create index competitions_season_idx on competitions (season);
create index competitions_track_idx on competitions (track_id);

create table races (
  id bigint generated always as identity primary key,
  competition_id bigint not null references competitions(id) on delete cascade,
  ssr_race_id integer,                  -- the `r` param from SSR links, when known
  distance integer not null,            -- meters; use 111/222 style codes for mass start/team if needed
  gender char(1) not null check (gender in ('m', 'f')),
  category text,
  unique (competition_id, ssr_race_id, distance, gender)
);

create table results (
  id bigint generated always as identity primary key,
  skater_id bigint not null references skaters(id) on delete cascade,
  race_id bigint references races(id) on delete set null,
  competition_id bigint references competitions(id) on delete set null,
  track_id integer references tracks(id),
  distance integer not null,
  gender char(1) not null check (gender in ('m', 'f')),
  season integer not null,
  time_ms integer not null,             -- null-free: DNF/DQ rows are excluded, not zeroed
  time_raw text not null,               -- original SSR formatting, e.g. "34,40" or "1.14,32"
  race_date date not null,
  is_pr boolean not null default false,
  is_sb boolean not null default false,
  ssr_link text,
  created_at timestamptz not null default now(),
  unique (skater_id, distance, race_date, time_ms, competition_id)
);
create index results_skater_idx on results (skater_id, distance);
create index results_season_idx on results (season, distance, gender);
create index results_time_idx on results (distance, gender, time_ms);

create table records (
  id bigint generated always as identity primary key,
  type text not null check (type in ('WR', 'OR', 'NR', 'TR')), -- world / olympic / national / track — no masters
  country char(3),                      -- required for NR
  track_id integer references tracks(id), -- required for TR
  gender char(1) not null check (gender in ('m', 'f')),
  distance integer not null,
  skater_id bigint references skaters(id),
  time_ms integer not null,
  time_raw text not null,
  race_date date,
  competition_id bigint references competitions(id),
  synced_at timestamptz not null default now()
);
create index records_lookup_idx on records (type, gender, distance, country, track_id);

create table sync_state (
  job text primary key,
  cursor jsonb,
  status text not null default 'idle',
  last_run_at timestamptz,
  last_error text
);

-- RLS: public read-only, writes only via service role (sync scripts)
alter table tracks enable row level security;
alter table skaters enable row level security;
alter table competitions enable row level security;
alter table races enable row level security;
alter table results enable row level security;
alter table records enable row level security;
alter table sync_state enable row level security;

create policy "public read" on tracks for select using (true);
create policy "public read" on skaters for select using (true);
create policy "public read" on competitions for select using (true);
create policy "public read" on races for select using (true);
create policy "public read" on results for select using (true);
create policy "public read" on records for select using (true);
-- sync_state has no public policy: only service role can read/write it
