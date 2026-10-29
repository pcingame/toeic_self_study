-- TOEIC self-study schema. Run this once in the Supabase SQL editor.

create table if not exists public.writing_questions (
  id uuid primary key default gen_random_uuid(),
  part smallint not null check (part in (1, 2, 3)), -- 1=sentence, 2=email, 3=essay
  group_label text not null, -- groups questions that share one exam timer (e.g. all 5 Part 1 sentences)
  order_index int not null,
  prompt_text text not null,
  context text,
  image_url text,
  time_limit_sec int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.speaking_questions (
  id uuid primary key default gen_random_uuid(),
  part smallint not null check (part between 1 and 5),
  group_label text not null, -- groups questions that share prep time (e.g. Q7-9 share one agenda)
  order_index int not null,
  prompt_text text not null,
  image_url text,
  audio_prompt_url text,
  prep_time_sec int not null default 0,
  speak_time_sec int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('writing_full', 'speaking_full', 'single')),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.writing_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.writing_questions(id) on delete cascade,
  session_id uuid references public.practice_sessions(id) on delete set null,
  answer_text text not null default '',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_sec int,
  score int, -- AI-graded score (see max_score for the scale, which varies by part)
  max_score int,
  feedback text,
  graded_at timestamptz
);

create table if not exists public.speaking_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.speaking_questions(id) on delete cascade,
  session_id uuid references public.practice_sessions(id) on delete set null,
  audio_path text,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_sec int,
  transcript text, -- captured client-side via the Web Speech API during recording
  score int,
  max_score int,
  feedback text,
  graded_at timestamptz
);

create index if not exists writing_attempts_user_idx on public.writing_attempts (user_id, started_at desc);
create index if not exists speaking_attempts_user_idx on public.speaking_attempts (user_id, started_at desc);

alter table public.writing_questions enable row level security;
alter table public.speaking_questions enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.writing_attempts enable row level security;
alter table public.speaking_attempts enable row level security;

drop policy if exists "writing questions readable" on public.writing_questions;
create policy "writing questions readable" on public.writing_questions
  for select using (auth.role() = 'authenticated');

drop policy if exists "speaking questions readable" on public.speaking_questions;
create policy "speaking questions readable" on public.speaking_questions
  for select using (auth.role() = 'authenticated');

drop policy if exists "own sessions" on public.practice_sessions;
create policy "own sessions" on public.practice_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own writing attempts" on public.writing_attempts;
create policy "own writing attempts" on public.writing_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own speaking attempts" on public.speaking_attempts;
create policy "own speaking attempts" on public.speaking_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket for speaking recordings. Files are stored as "<user_id>/<question_id>/<timestamp>.webm".
insert into storage.buckets (id, name, public)
values ('speaking-recordings', 'speaking-recordings', false)
on conflict (id) do nothing;

drop policy if exists "own recordings read" on storage.objects;
create policy "own recordings read" on storage.objects
  for select using (
    bucket_id = 'speaking-recordings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "own recordings insert" on storage.objects;
create policy "own recordings insert" on storage.objects
  for insert with check (
    bucket_id = 'speaking-recordings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "own recordings delete" on storage.objects;
create policy "own recordings delete" on storage.objects
  for delete using (
    bucket_id = 'speaking-recordings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage bucket for Writing/Speaking question reference images (private).
-- These are shared practice-question assets, not per-user content, so read
-- access is scoped to any authenticated user rather than by folder owner.
insert into storage.buckets (id, name, public)
values ('question-images', 'question-images', false)
on conflict (id) do nothing;

drop policy if exists "question images read" on storage.objects;
create policy "question images read" on storage.objects
  for select using (
    bucket_id = 'question-images'
    and auth.role() = 'authenticated'
  );

-- Pronunciation practice lists (see migrations/20261026231957_pronunciation_lists.sql)
create table if not exists public.pronunciation_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pronunciation_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.pronunciation_lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  order_index int not null
);

create index if not exists pronunciation_lists_user_idx on public.pronunciation_lists (user_id, created_at desc);
create index if not exists pronunciation_items_list_idx on public.pronunciation_items (list_id, order_index);

alter table public.pronunciation_lists enable row level security;
alter table public.pronunciation_items enable row level security;

drop policy if exists "own pronunciation lists" on public.pronunciation_lists;
create policy "own pronunciation lists" on public.pronunciation_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own pronunciation items" on public.pronunciation_items;
create policy "own pronunciation items" on public.pronunciation_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
