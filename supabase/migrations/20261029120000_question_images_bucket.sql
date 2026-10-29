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
