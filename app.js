const app=$('#app'),H={apikey:CFG.KEY,'Content-Type':'application/json'};
const GAMES=[
{t:'Utility Rush',s:'Thinking Like an Economist',e:'🥟',c:'#22d3ee',d:'Stack samosas, slide the frontier, spot hidden assumptions.'},
{t:'Chase the Equilibrium',s:'Demand & Supply',e:'📈',c:'#fbbf24',d:'Shift the right curve, then call the new price and quantity.'},
{t:'Price Is Right?',s:'Elasticity',e:'🏷️',c:'#f472b6',d:'Run a stall for 5 days and find the revenue-maximising price.'},
{t:'Slutsky Lab',s:'Effects & Concepts',e:'🔬',c:'#a78bfa',d:'Split substitution from income effects, then detect the good.'}];
let rows=[],cur=0;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function load(){try{const r=await fetch(CFG.URL+'/rest/v1/scores?select=name,game,score,time_ms,created_at&limit=5000',{headers:{apikey:CFG.KEY}});const j=await r.json();rows=Array.isArray(j)?j:[]}catch(e){}draw()}
function board(g){const m={};rows.forEach(r=>{if(g&&r.game!=g)return;const k=r.name.toLowerCase()+'|'+r.game,o=m[k];if(!o||r.score>o.score||(r.score==o.score&&r.time_ms<o.time_ms))m[k]=r});
const b=Object.values(m);if(g)return b.map(r=>({name:r.name,score:r.score,time:r.time_ms,at:r.created_at})).sort((a,c)=>c.score-a.score||a.time-c.time||a.at.localeCompare(c.at));
const t={};b.forEach(r=>{const k=r.name.toLowerCase();t[k]=t[k]||{name:r.name,score:0,time:0};t[k].score+=r.score;t[k].time+=r.time_ms});return Object.values(t).sort((a,c)=>c.score-a.score||a.time-c.time)}
function lb(g,n){const me=(localStorage.eq_name||'').toLowerCase();return `<ol class="lb">${board(g).slice(0,n).map((r,i)=>`<li class="${r.name.toLowerCase()==me?'me':''}"><span class="rk">${['🥇','🥈','🥉'][i]||i+1}</span><span class="nm">${esc(r.name)}</span><span class="sc">${r.score}</span></li>`).join('')||'<li class="empty">No scores yet. Be the first!</li>'}</ol>`}
function draw(){const a=$('#lbHome');if(a)a.innerHTML=lb(0,15);const b=$('#lb');if(b)b.innerHTML=lb(cur,15);document.querySelectorAll('.bestline').forEach(e=>{const v=localStorage['eq_best_'+e.dataset.g];e.textContent=v?'Your best: '+v:''})}
function home(){cur=0;app.innerHTML=`<section class="hero"><h1>Think. Play. <span>Reach equilibrium.</span></h1><p>Four economics games · unlimited tries · your best score counts · no login</p></section>
<section class="grid">${GAMES.map((g,i)=>{const n=i+1,ok=n<=CFG.OPEN_GAMES;return `<a class="card" style="--c:${g.c}" href="${ok?'#g'+n:'#'}"><div class="em">${g.e}</div><b>Game ${n}</b><h3>${g.t}</h3><i>${g.s}</i><p>${g.d}</p><div class="bestline" data-g="${n}"></div><span class="go">${ok?'Play →':'🔒 Coming soon'}</span></a>`}).join('')}</section>
<section class="panel"><h2>🏆 Overall leaderboard <small>sum of best scores · out of 4,000</small></h2><div id="lbHome"></div></section>`;draw()}
function game(n){cur=n;const g=GAMES[n-1];app.innerHTML=`<a class="back" href="#">← All games</a><div class="gwrap"><section class="panel play" style="--c:${g.c}"><h2>${g.e} ${g.t} <small>${g.s}</small></h2><div id="stage"></div></section><aside class="panel"><h2>🏆 ${g.t} <small>best scores</small></h2><div id="lb"></div></aside></div>`;draw();run(n)}
function run(n){clearTimers();const st=$('#stage'),g=G[n];st.innerHTML=`<div class="intro">${g.intro}<button id="go" class="btn">Start</button></div>`;$('#go').onclick=()=>{const t0=Date.now();st.innerHTML='';g.play(st,sc=>finish(n,sc,Date.now()-t0))}}
const grade=s=>s>=900?'🏅 Brilliant!':s>=700?'🔥 Strong run':s>=450?'👍 Solid, try to beat it':'🌱 Keep practising';
function finish(n,sc,ms){clearTimers();sc=Math.round(Math.max(0,Math.min(1000,sc)));const k='eq_best_'+n;if(sc>(+localStorage[k]||0))localStorage[k]=sc;
$('#stage').innerHTML=`<div class="result"><div class="big">${sc}<small>/1000</small></div><p>${grade(sc)}</p><p class="mut">Time ${(ms/1000).toFixed(1)}s · only your best attempt counts</p><input id="nm" maxlength="24" placeholder="Your name (shown on leaderboard)" value="${esc(localStorage.eq_name||'')}"><div class="row" style="justify-content:center"><button id="sub" class="btn">Submit score</button><button id="again" class="btn ghost">Play again</button></div><p id="msg" class="mut"></p></div>`;
$('#again').onclick=()=>run(n);
$('#sub').onclick=async()=>{const nm=$('#nm').value.trim();if(!nm){$('#msg').textContent='Enter a name first.';return}localStorage.eq_name=nm;$('#sub').disabled=true;
try{const r=await fetch(CFG.URL+'/rest/v1/scores',{method:'POST',headers:{...H,Prefer:'return=minimal'},body:JSON.stringify({name:nm,game:n,score:sc,time_ms:ms})});if(!r.ok)throw 0;$('#msg').textContent='✅ Submitted! It shows on the leaderboard if it is your best.';$('#sub').remove();load()}catch(e){$('#msg').textContent='Could not submit. Check connection and try again.';$('#sub').disabled=false}}}
function route(){clearTimers();const m=/^#g([1-4])$/.exec(location.hash);m&&+m[1]<=CFG.OPEN_GAMES?game(+m[1]):home()}
onhashchange=route;route();load();setInterval(load,15000);
