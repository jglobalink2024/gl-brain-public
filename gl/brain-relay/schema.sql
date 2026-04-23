-- brain-relay schema
-- [PERSISTENT]
-- Run in SQL Editor of each brain Supabase project: gl-brain, pl-brain, hearth-brain
-- No RLS — service_role only access

-- Commit log: every push event
create table if not exists brain_commits (
  id              bigserial primary key,
  brain_id        text        not null,
  commit_sha      text        not null unique,
  message         text        not null,
  author_name     text        not null default '',
  author_email    text        not null default '',
  committed_at    timestamptz not null,
  files_added     text[]      not null default '{}',
  files_modified  text[]      not null default '{}',
  files_removed   text[]      not null default '{}',
  raw_payload     jsonb,
  created_at      timestamptz not null default now()
);

-- Latest push state: one row per brain (upserted on every push)
create table if not exists brain_state (
  brain_id            text        primary key,
  last_commit_sha     text        not null default '',
  last_commit_message text        not null default '',
  last_pushed_at      timestamptz,
  ref                 text        not null default '',
  pusher              text        not null default '',
  updated_at          timestamptz not null default now()
);

-- Keep updated_at current
create or replace function update_brain_state_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists brain_state_updated_at on brain_state;
create trigger brain_state_updated_at
  before update on brain_state
  for each row execute function update_brain_state_timestamp();
