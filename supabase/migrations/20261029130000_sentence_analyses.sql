-- Saved AI-generated sentence breakdowns (IPA, word-by-word, grammar
-- structure) -- see src/lib/sentenceAnalysis.ts for the shape of
-- `words` and `clauses`.
create table if not exists public.sentence_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sentence text not null,
  translation text not null,
  ipa_us text not null,
  ipa_uk text not null,
  vietnamese_approx text not null,
  note text,
  words jsonb not null,
  clauses jsonb not null,
  structure_pattern text not null,
  structure_legend text not null,
  created_at timestamptz not null default now()
);

create index if not exists sentence_analyses_user_idx on public.sentence_analyses (user_id, created_at desc);

alter table public.sentence_analyses enable row level security;

drop policy if exists "own sentence analyses" on public.sentence_analyses;
create policy "own sentence analyses" on public.sentence_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
