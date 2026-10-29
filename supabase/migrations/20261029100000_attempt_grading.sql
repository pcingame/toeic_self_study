-- AI grading fields for Writing/Speaking attempts.
alter table public.writing_attempts
  add column if not exists score int,
  add column if not exists max_score int,
  add column if not exists feedback text,
  add column if not exists graded_at timestamptz;

alter table public.speaking_attempts
  add column if not exists transcript text,
  add column if not exists score int,
  add column if not exists max_score int,
  add column if not exists feedback text,
  add column if not exists graded_at timestamptz;
