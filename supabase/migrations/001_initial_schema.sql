-- MedReview Supabase Schema
-- Run this in the Supabase SQL editor. Safe to re-run — all statements are idempotent.

-- ─────────────────────────────────────
-- profiles
-- ─────────────────────────────────────
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique not null,
  display_name text,
  avatar_url text,
  consent_accepted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
drop policy if exists "profiles_update_own" on profiles;

create policy "profiles_select_own"
  on profiles for select
  using (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "profiles_update_own"
  on profiles for update
  using (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- ─────────────────────────────────────
-- reviews
-- ─────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  genlayer_review_id text unique not null,
  user_wallet text not null,
  review_type text check (review_type in ('symptom', 'report', 'medication_concern', 'follow_up', 'child_symptom', 'pregnancy_concern')),
  title text,
  summary text,
  urgency_level text,
  status text default 'created',
  red_flags_present boolean default false,
  latest_genlayer_tx text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table reviews enable row level security;

drop policy if exists "reviews_select_own" on reviews;

create policy "reviews_select_own"
  on reviews for select
  using (user_wallet = current_setting('request.jwt.claims', true)::json->>'sub');

-- ─────────────────────────────────────
-- triage_results
-- ─────────────────────────────────────
create table if not exists triage_results (
  id uuid primary key default gen_random_uuid(),
  genlayer_review_id text not null,
  urgency_level text,
  confidence numeric,
  possible_condition_categories jsonb,
  red_flags_present boolean,
  red_flags jsonb,
  summary text,
  recommended_next_step text,
  self_care_general jsonb,
  what_to_monitor jsonb,
  questions_for_doctor jsonb,
  not_diagnosis_notice text,
  reasoning text,
  raw_result jsonb,
  genlayer_tx text,
  created_at timestamptz default now()
);

alter table triage_results enable row level security;

drop policy if exists "triage_results_select_own" on triage_results;

create policy "triage_results_select_own"
  on triage_results for select
  using (
    exists (
      select 1 from reviews r
      where r.genlayer_review_id = triage_results.genlayer_review_id
        and r.user_wallet = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- ─────────────────────────────────────
-- followups
-- ─────────────────────────────────────
create table if not exists followups (
  id uuid primary key default gen_random_uuid(),
  genlayer_followup_id text unique not null,
  genlayer_review_id text not null,
  user_wallet text not null,
  symptom_change text,
  current_severity integer,
  new_symptoms jsonb,
  resolved_symptoms jsonb,
  free_text text,
  latest_genlayer_tx text,
  created_at timestamptz default now()
);

alter table followups enable row level security;

drop policy if exists "followups_select_own" on followups;
drop policy if exists "followups_insert_own" on followups;

create policy "followups_select_own"
  on followups for select
  using (user_wallet = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "followups_insert_own"
  on followups for insert
  with check (user_wallet = current_setting('request.jwt.claims', true)::json->>'sub');

-- ─────────────────────────────────────
-- safety_flags
-- ─────────────────────────────────────
create table if not exists safety_flags (
  id uuid primary key default gen_random_uuid(),
  genlayer_review_id text not null,
  user_wallet text not null,
  urgency_override text,
  red_flags jsonb,
  safety_message text,
  genlayer_tx text,
  created_at timestamptz default now()
);

alter table safety_flags enable row level security;

drop policy if exists "safety_flags_select_own" on safety_flags;

create policy "safety_flags_select_own"
  on safety_flags for select
  using (user_wallet = current_setting('request.jwt.claims', true)::json->>'sub');

-- ─────────────────────────────────────
-- transactions
-- ─────────────────────────────────────
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  genlayer_review_id text,
  action text not null,
  tx_hash text,
  status text check (status in ('pending', 'confirmed', 'failed')) default 'pending',
  request_payload jsonb,
  response_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table transactions enable row level security;

drop policy if exists "transactions_select_own" on transactions;

create policy "transactions_select_own"
  on transactions for select
  using (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- ─────────────────────────────────────
-- notifications
-- ─────────────────────────────────────
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  title text not null,
  body text not null,
  type text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

drop policy if exists "notifications_select_own" on notifications;
drop policy if exists "notifications_update_own" on notifications;

create policy "notifications_select_own"
  on notifications for select
  using (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "notifications_update_own"
  on notifications for update
  using (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- ─────────────────────────────────────
-- Grants
-- ─────────────────────────────────────
grant all privileges on all tables    in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all tables    in schema public to authenticated;
grant all privileges on all sequences in schema public to authenticated;

-- ─────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────
create index if not exists idx_reviews_user_wallet      on reviews(user_wallet);
create index if not exists idx_reviews_genlayer_id      on reviews(genlayer_review_id);
create index if not exists idx_triage_results_review_id on triage_results(genlayer_review_id);
create index if not exists idx_followups_review_id      on followups(genlayer_review_id);
create index if not exists idx_followups_user_wallet    on followups(user_wallet);
create index if not exists idx_transactions_wallet      on transactions(wallet_address);
create index if not exists idx_notifications_wallet     on notifications(wallet_address);
create index if not exists idx_safety_flags_review_id   on safety_flags(genlayer_review_id);
