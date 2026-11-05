/* EQUILIBRIA shared engine. Every page loads this. Paste Supabase keys below. */
const EQ = { SUPABASE_URL: "https://tsbbucixnnfodjxjebap.supabase.co", SUPABASE_ANON_KEY: "sb_publishable_IgJCHoGdmBza4ctSNxPo8w_hzWiUXiT" }; // empty = demo mode (this browser only)

const Eq = (() => {
  const demo = !EQ.SUPABASE_URL, LS = localStorage;
  const J = (k, d) => { try { return JSON.parse(LS.getItem(k)) ?? d } catch { return d } };
  const S = (k, v) => LS.setItem(k, JSON.stringify(v));
  const $ = (s, r = document) => r.querySelector(s);
  let sb = null;
  if (!demo && window.supabase) sb = supabase.createClient(EQ.SUPABASE_URL, EQ.SUPABASE_ANON_KEY);

  document.head.insertAdjacentHTML("beforeend", `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>
:root{--bg:#f6f7f9;--card:#fff;--fg:#0f1b2d;--mut:#5b6678;--line:#e3e7ee;--brand:#0f766e;--acc:#f59e0b;--bad:#dc2626;--ok:#16a34a}
@media(prefers-color-scheme:dark){:root{--bg:#0b1220;--card:#121b2d;--fg:#eaf0fa;--mut:#93a0b5;--line:#22304a;--brand:#2dd4bf;--acc:#fbbf24}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 Inter,system-ui,sans-serif}
a{color:inherit;text-decoration:none}.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
header{border-bottom:1px solid var(--line);background:var(--card)}header .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
.brand{display:flex;align-items:center;gap:10px;font:700 22px Fraunces,Georgia,serif;letter-spacing:-.01em}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px}
.btn{background:var(--brand);color:#fff;border:0;border-radius:10px;padding:10px 18px;font:600 15px Inter;cursor:pointer}
@media(prefers-color-scheme:dark){.btn{color:#06201d}}
.btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line)}.btn:disabled{opacity:.45;cursor:not-allowed}
input{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--fg);font:15px Inter;margin:4px 0 12px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.tag{font-size:12px;font-weight:600;padding:2px 8px;border-radius:99px;background:var(--acc);color:#1b1300}
.mut{color:var(--mut)}table{width:100%;border-collapse:collapse;font-size:14px}td,th{padding:8px 6px;text-align:left;border-bottom:1px solid var(--line)}
.me{background:color-mix(in srgb,var(--brand) 16%,transparent)}
.modal{position:fixed;inset:0;background:#000a;display:flex;align-items:center;justify-content:center;padding:16px;z-index:9}
.modal .card{max-width:640px;max-height:90vh;overflow:auto}.modal h3{margin:.8em 0 .3em}.modal ul{margin:.3em 0;padding-left:20px}
</style>`);

  const logo = (s = 36) => `<svg viewBox="0 0 40 40" width="${s}" height="${s}" role="img" aria-label="Equilibria"><rect width="40" height="40" rx="10" fill="var(--brand)"/><path d="M10 11Q15 26 31 30" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M30 11Q25 26 9 30" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.6" stroke-linecap="round"/><circle cx="20" cy="25" r="3.6" fill="var(--acc)" stroke="#fff" stroke-width="1.6"/></svg>`;
  const head = (right = "") => `<header><div class="wrap"><a class="brand" href="index.html">${logo()}equilibria</a><div>${right}</div></div></header>`;

  async function player() {
    if (demo) return J("eq_player", null);
    const { data } = await sb.auth.getSession(); const u = data.session?.user;
    return u ? { name: u.user_metadata.name, section: u.user_metadata.section, email: u.email } : null;
  }
  async function sendCode(email, name, section) {
    if (demo) return S("eq_player", { name, section });
    const { error } = await sb.auth.signInWithOtp({ email, options: { data: { name, section } } }); if (error) throw error;
  }
  async function verify(email, token) {
    const { error } = await sb.auth.verifyOtp({ email, token, type: "email" }); if (error) throw error;
  }
  const logout = async () => { demo ? LS.removeItem("eq_player") : await sb.auth.signOut(); location.href = "index.html"; };

  async function done() {
    if (demo) return J("eq_done", {});
    const { data } = await sb.from("progress").select("game_id"); return Object.fromEntries((data || []).map(r => [r.game_id, 1]));
  }
  async function gate(id) {            // call at top of every game page
    const p = await player(); const i = GAMES.findIndex(g => g.id === id), d = await done();
    if (!p || (i > 0 && !d[GAMES[i - 1].id])) { location.href = "index.html"; return null; }
    return p;
  }
  async function start(game) {         // server decides seed + ranked/practice
    if (!demo) { const { data, error } = await sb.functions.invoke("start-attempt", { body: { game } }); if (error) throw error; return data; }
    const a = J("eq_att", {}); const no = (a[game] || 0) + 1; a[game] = no; S("eq_att", a);
    return { id: crypto.randomUUID(), seed: Math.random() * 2 ** 32 >>> 0, no, ranked: no <= 3 };
  }
  async function finish(game, att, actions, localScore) {
    if (!demo) { const { data, error } = await sb.functions.invoke("finish-attempt", { body: { attempt_id: att.id, actions } }); if (error) throw error; return data; }
    const p = J("eq_player"), d = J("eq_done", {}); d[game] = 1; S("eq_done", d);
    if (att.ranked) { const s = J("eq_scores", {}); s[game] = s[game] || {}; const k = p.name + "|" + p.section; s[game][k] = { name: p.name, section: p.section, best: Math.max(localScore, s[game][k]?.best || 0) }; S("eq_scores", s); }
    return { score: localScore, ranked: att.ranked };
  }

  async function rows(game) {
    if (!demo) {
      const q = game ? sb.from("scores").select("*").eq("game_id", game).order("best", { ascending: false }).order("time_ms").limit(20)
                     : sb.from("leaderboard_overall").select("*").order("best", { ascending: false }).limit(20);
      return (await q).data || [];
    }
    const s = J("eq_scores", {}), m = {};
    for (const g of game ? [game] : Object.keys(s)) for (const [k, v] of Object.entries(s[g] || {})) { m[k] = m[k] || { ...v, best: 0 }; m[k].best += v.best; }
    return Object.values(m).sort((a, b) => b.best - a.best).slice(0, 20);
  }
  async function board(el, game) {      // public, live
    const me = await player();
    const draw = async () => {
      const r = await rows(game);
      el.innerHTML = r.length ? `<table><tr><th>#</th><th>Name</th><th>Section</th><th style="text-align:right">Score</th></tr>${r.map((x, i) =>
        `<tr class="${me && x.name === me.name && x.section === me.section ? "me" : ""}"><td>${i + 1}</td><td>${esc(x.name)}</td><td class="mut">${esc(x.section || "")}</td><td style="text-align:right"><b>${x.best}</b></td></tr>`).join("")}</table>`
        : `<p class="mut">No ranked scores yet. Be the first.</p>`;
    };
    await draw();
    if (!demo) sb.channel("lb" + (game || "all") + Math.random()).on("postgres_changes", { event: "*", schema: "public", table: "scores" }, draw).subscribe();
    else addEventListener("storage", draw);
    return draw;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const COMMON = ["You get <b>3 ranked attempts</b> per game. The best of the three goes on the leaderboard.",
    "From attempt 4 onwards you can keep playing, but those runs are <b>Practice: not ranked</b>.",
    "Finishing every round of a game (any score) unlocks the next game.",
    "Every attempt has different random values. Scores are calculated on the server from your moves, so they cannot be edited.",
    "Ties are broken by total time, then by who submitted first.",
    "One account per student. Your attempts follow your email on any device or browser."];
  function rules(spec, startLabel = "I have read the rules. Start") {
    return new Promise(res => {
      const m = document.createElement("div"); m.className = "modal";
      m.innerHTML = `<div class="card"><h2 style="margin:0">${spec.title}</h2><p class="mut">${spec.intro}</p><h3>Rounds and points</h3><ul>${spec.rounds.map(r => `<li><b>${r[0]}</b> (${r[1]} pts): ${r[2]}</li>`).join("")}</ul><h3>How to score well</h3><ul>${spec.tips.map(t => `<li>${t}</li>`).join("")}</ul><h3>Rules for every game</h3><ul>${COMMON.map(t => `<li>${t}</li>`).join("")}</ul><p style="text-align:right"><button class="btn">${startLabel}</button></p></div>`;
      m.querySelector("button").onclick = () => { m.remove(); res(); }; document.body.append(m);
    });
  }
  return { demo, logo, head, player, sendCode, verify, logout, done, gate, start, finish, board, rules, esc, $ };
})();
