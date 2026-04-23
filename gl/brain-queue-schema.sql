-- brain_queue schema
-- [PERSISTENT]
-- Apply via SQL Editor of each brain Supabase project:
--   gl-brain     (wlhodjpgidopmtkqxtss)
--   pl-brain     (hrmlntvdbvxypversnfv)
--   hearth-brain (jexhxufepfcdhbpkvjck)
-- No RLS — service_role only.

create table if not exists brain_queue (
  id             uuid         primary key default gen_random_uuid(),
  created_at     timestamptz  not null    default now(),
  file_path      text         not null,
  operation      text         not null check (operation in ('append','full_replace')),
  section_header text,
  content        text         not null,
  via            text         not null    default 'chat',
  committed_at   timestamptz,
  commit_sha     text
);

create index if not exists brain_queue_pending_idx
  on brain_queue (created_at)
  where committed_at is null;

-- Quarantine for auto-classifier low-confidence routes
create table if not exists brain_quarantine (
  id             uuid         primary key default gen_random_uuid(),
  created_at     timestamptz  not null    default now(),
  content        text         not null,
  suggested_brain text,
  confidence     real,
  reasoning      text,
  resolved_at    timestamptz,
  resolved_brain text
);
