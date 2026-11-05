-- Paste into Supabase > SQL Editor > Run
create table if not exists public.scores(
  id bigint generated always as identity primary key,
  name text not null check(char_length(name) between 1 and 24),
  game smallint not null check(game between 1 and 4),
  score int not null check(score between 0 and 1000),
  time_ms int not null check(time_ms >= 0),
  created_at timestamptz not null default now());
create index if not exists scores_game_idx on public.scores(game, score desc);
alter table public.scores enable row level security;
create policy "public read" on public.scores for select using (true);
create policy "public insert" on public.scores for insert with check (true);

-- Required on newer Supabase projects: expose the table to the public API
grant usage on schema public to anon, authenticated;
grant select, insert on public.scores to anon, authenticated;
