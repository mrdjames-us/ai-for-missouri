-- Public gatherings and staff desk. Events are world-readable; writes go
-- through signed-in staff only.

create table if not exists staff (
  email      text primary key,
  name       text,
  role       text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

insert into staff (email, name, role)
values ('david@aiformissouri.com', 'David James', 'owner')
on conflict (email) do nothing;

create table if not exists events (
  slug            text primary key,
  kind            text not null check (kind in ('hackathon', 'workshop', 'seminar')),
  title           text not null,
  lede            text not null,
  city            text not null,
  venue           text not null,
  region          text not null,
  start_date      date not null,
  end_date        date not null,
  when_label      text not null,
  time_label      text not null,
  duration_label  text not null,
  capacity        integer not null default 24,
  reserved        integer not null default 0,
  status          text not null default 'upcoming' check (status in ('upcoming', 'past')),
  image           text not null,
  featured        boolean not null default false,
  who             jsonb not null default '[]'::jsonb,
  bring           jsonb not null default '[]'::jsonb,
  agenda          jsonb not null default '[]'::jsonb,
  tracks          jsonb,
  body            jsonb not null default '[]'::jsonb,
  updated_at      timestamptz not null default now(),
  updated_by      text
);

create index if not exists events_start_idx on events (start_date);
create index if not exists events_status_idx on events (status);

create table if not exists pages (
  slug       text primary key,
  heading    text,
  kicker     text,
  lede       text,
  body       jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);
