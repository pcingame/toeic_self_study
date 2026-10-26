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
