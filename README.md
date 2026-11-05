# Equilibria
Static site, no build step, no login.
1. Supabase > SQL Editor: run `supabase.sql` (once).
2. Push this folder to a GitHub repo > Settings > Pages > Deploy from branch `main` / root.
3. Keys live in `js/config.js`. Set `OPEN_GAMES` (1-4) to control which games are open.
Scores are best-per-name-per-game; overall = sum of the four bests (max 4000). Ties: faster time wins.
