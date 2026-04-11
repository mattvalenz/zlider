-- Decks for AI slide maker (RLS: owner-only access)

create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled deck',
  theme_id text not null default 'ocean',
  tone text not null default 'professional',
  slides jsonb not null default '[]'::jsonb,
  outline jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decks_user_id_idx on public.decks (user_id);
create index if not exists decks_updated_at_idx on public.decks (updated_at desc);

alter table public.decks enable row level security;

create policy "Users select own decks"
  on public.decks for select
  using (auth.uid() = user_id);

create policy "Users insert own decks"
  on public.decks for insert
  with check (auth.uid() = user_id);

create policy "Users update own decks"
  on public.decks for update
  using (auth.uid() = user_id);

create policy "Users delete own decks"
  on public.decks for delete
  using (auth.uid() = user_id);
