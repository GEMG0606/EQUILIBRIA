const $=(s,e=document)=>e.querySelector(s),R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),sh=a=>[...a].sort(()=>Math.random()-.5);
const timers=[],every=(f,ms)=>{const i=setInterval(f,ms);timers.push(i);return i},clearTimers=()=>timers.splice(0).forEach(clearInterval);
const G={};
const grp=(id,lab,o)=>`<div class="grp" id="${id}"><span>${lab}</span>${o.map(([v,t])=>`<button class="opt sm" data-v="${v}">${t}</button>`).join('')}</div>`;
const grpInit=el=>el.querySelectorAll('.grp').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{g.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel')}));
const val=(el,id)=>{const b=$('#'+id+' .sel',el);return b?b.dataset.v:null};
const nextBtn=(el,f,t='Next →')=>{el.insertAdjacentHTML('beforeend',`<button class="btn" id="nx">${t}</button>`);$('#nx',el).onclick=f};

/* ---------- GAME 1: Utility Rush ---------- */
const CL=[
['Sales rose after the ad, so the ad worked.','Nothing else that could raise sales changed (ceteris paribus)','Ads always pay for themselves','Sales can only go up'],
['Cities with more police have more crime, so police cause crime.','Police numbers do not respond to crime levels','Crime is measured in numbers','All cities are the same size'],
['Students who skip breakfast score lower, so breakfast boosts marks.','Nothing else (sleep, family income) differs between the groups','Breakfast is a normal good','Marks cannot be improved'],
['Raising the minimum wage will cut jobs, because wages are a cost.','Demand and productivity stay unchanged when wages rise','Wages are paid monthly','Firms never hire'],
['What is good for one household must be good for the whole economy.','The whole economy behaves just like one household','Households never save','Economies have no households'],
['Ice cream sales and drownings rise together, so ice cream causes drowning.','No third factor (hot weather) drives both','Ice cream is an inferior good','Swimming is free'],
['Tea price rose and tea sales also rose, so the law of demand is wrong.','Tastes, income and other prices stayed the same','Tea is always a Giffen good','Sales equal price']];
G[1]={intro:'<h3>3 rounds · 1000 pts</h3><p><b>1 · Samosa Stack (400)</b> Eat to raise total utility, then bank before marginal utility turns negative. The hidden curve changes every try.<br><b>2 · Six-Hour Frontier (300)</b> Split 6 hours between study and gaming to meet each scenario.<br><b>3 · Spot the Assumption (300)</b> Tap the buried assumption. Faster is better.</p>',
play(el,done){let s1=0,s2=0;
const foods=sh([['🥟','Samosa'],['🍕','Pizza slice'],['🍦','Ice cream'],['🍜','Noodles']]).slice(0,3);let fi=0;
const food=()=>{const [em,nm]=foods[fi],u0=RI(24,40),d=R(3,6.5),mu=[];for(let i=0;i<14;i++)mu.push(Math.round(u0-d*i+R(-1.5,1.5)));
let c=0,bt=1;mu.forEach(m=>{c+=m;bt=Math.max(bt,c)});let k=0,tot=0;
const ui=()=>{el.innerHTML=`<div class="rnd">Round 1 · food ${fi+1}/3</div><div class="food">${em.repeat(Math.min(k,12))||'🍽️'}</div><h3>${nm}</h3><div class="stats"><div>Eaten<b>${k}</b></div><div>Total utility<b>${tot}</b></div><div>Last marginal<b>${k?mu[k-1]:'—'}</b></div></div><div class="row"><button class="btn" id="eat" ${k>=14?'disabled':''}>Eat one</button><button class="btn ghost" id="bank">Bank it</button></div>`;
$('#eat',el).onclick=()=>{tot+=mu[k];k++;ui()};$('#bank',el).onclick=()=>{s1+=400/3*Math.max(0,tot)/bt;fi++;fi<3?food():r2()}};ui()};
const r2=()=>{const S=sh([['📝 Surprise test tomorrow! Study at least 5 hours.',(s,g)=>s>=5],['🎮 Gaming tournament tonight! Game at least 4 hours.',(s,g)=>g>=4],['⚖️ House rule: neither activity may exceed the other by more than 1 hour.',(s,g)=>Math.abs(s-g)<=1],['📚 Exam in 2 days: study at least 3 hours, game at most 3.',(s,g)=>s>=3&&g<=3]]).slice(0,3);let i=0;
const sc=()=>{if(i>=3){r3();return}el.innerHTML=`<div class="rnd">Round 2 · frontier ${i+1}/3</div><div class="claim">${S[i][0]}</div><p class="mut">You have 6 hours. Using all of them puts you <b>on</b> the frontier.</p>Study: <b id="sv">3</b>h <input type="range" id="s" min="0" max="6" value="3"><br>Gaming: <b id="gv">3</b>h <input type="range" id="g" min="0" max="6" value="3"><div id="fb"></div><button class="btn" id="ok">Lock in</button>`;
const up=()=>{$('#sv',el).textContent=$('#s',el).value;$('#gv',el).textContent=$('#g',el).value};$('#s',el).oninput=$('#g',el).oninput=up;
$('#ok',el).onclick=function(){const s=+$('#s',el).value,g=+$('#g',el).value,on=s+g==6,goal=S[i][1](s,g);s2+=100*(.5*on+.5*goal);this.remove();$('#fb',el).innerHTML=(on?'✅ On the frontier. ':s+g<6?'⚠️ Inside the frontier (wasted time). ':'🚫 Beyond the frontier (impossible). ')+(goal?'✅ Goal met.':'❌ Goal missed.');i++;nextBtn(el,sc)};};sc()};
const r3=()=>{const cs=sh(CL).slice(0,6);let i=0,s3=0;const nx=()=>{if(i>=6){done(s1+s2+s3);return}const [q,ok,...bad]=cs[i],T=12000,t0=Date.now();
el.innerHTML=`<div class="rnd">Round 3 · ${i+1}/6 · tap the hidden assumption</div><div class="claim">“${q}”</div><div class="bar"><i id="bar"></i></div><div class="opts">${sh([ok,...bad]).map(o=>`<button class="opt">${o}</button>`).join('')}</div>`;
let over=false;const iv=every(()=>{const l=Math.max(0,1-(Date.now()-t0)/T);const b=$('#bar',el);if(b)b.style.width=l*100+'%';if(l<=0&&!over){over=true;clearInterval(iv);i++;nx()}},100);
el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(over)return;over=true;clearInterval(iv);const l=Math.max(0,1-(Date.now()-t0)/T),good=b.textContent==ok;if(good)s3+=25+25*l;b.classList.add(good?'ok':'bad');i++;setTimeout(nx,700)})};nx()};
food()}};

/* ---------- GAME 2: Chase the Equilibrium ---------- */
const LV=[[300,[['Incomes rise (pizza is a normal good)',1,0],['A viral trend makes pizza fashionable',1,0],['Cheese prices jump',0,-1],['New ovens make baking cheaper and faster',0,1],['A health scare turns people off pizza',-1,0],['A failed wheat harvest makes flour costly',0,-1],['A new college brings thousands of extra buyers',1,0]],6],
[350,[['The price of pizza itself falls',0,0],['Incomes rise, but the good is an inferior good (instant noodles)',-1,0],['Buyers expect pizza prices to rise next month',1,0],['The price of pizza itself rises',0,0],['Price of burgers (a substitute) falls',-1,0],['Sellers expect higher prices next month and hold stock back',0,-1],['A per-unit tax is imposed on sellers',0,-1]],6],
[350,[['Pizza turns fashionable AND ovens improve',1,1],['Incomes rise AND cheese costs surge',1,-1],['Health scare AND new technology',-1,1],['Fad fades AND flour costs soar',-1,-1],['Tastes improve AND input costs fall',1,1],['Incomes fall AND sellers face a tax',-1,-1]],5]];
const gsvg=(dd,ds,rev)=>{const sd=dd*40,ss=ds*40,D=o=>`x1="40" y1="${40-o*2/3}" x2="280" y2="${40+(240-o)*2/3}"`,S=o=>`x1="40" y1="${200+o*2/3}" x2="280" y2="${200-(240-o)*2/3}"`,ex=160+(sd+ss)/2,ey=40+(ex-40-sd)*2/3;
return `<svg class="g" viewBox="0 0 320 240"><defs><clipPath id="cp"><rect x="40" y="20" width="250" height="200"/></clipPath></defs><path d="M40 20V220H290" stroke="#93a0cf" fill="none"/><text x="292" y="226" fill="#93a0cf" font-size="11">Q</text><text x="28" y="16" fill="#93a0cf" font-size="11">P</text><g clip-path="url(#cp)" stroke-width="3" stroke-linecap="round"><line ${D(0)} stroke="#22d3ee" ${rev?'stroke-dasharray="5 5" opacity=".4"':''}/><line ${S(0)} stroke="#fbbf24" ${rev?'stroke-dasharray="5 5" opacity=".4"':''}/>${rev?`<line ${D(sd)} stroke="#22d3ee"/><line ${S(ss)} stroke="#fbbf24"/>`:''}</g><text x="250" y="190" fill="#22d3ee" font-size="12">D</text><text x="250" y="60" fill="#fbbf24" font-size="12">S</text><circle cx="160" cy="120" r="4" fill="#fff" opacity=".6"/>${rev?`<circle cx="${ex}" cy="${ey}" r="7" fill="#f472b6" stroke="#fff" stroke-width="2"/>`:''}</svg>`};
G[2]={intro:'<h3>3 levels · 1000 pts</h3><p>An event hits the pizza market. Choose whether <b>demand</b> and <b>supply</b> shift left, right, or not at all (a price change is only a <i>movement</i>), then call the new <b>price</b> and <b>quantity</b>. Use <b>?</b> when the effect is ambiguous and <b>—</b> for no change. Speed earns a bonus on perfect calls.</p>',
play(el,done){let s=0,li=0,ei=0;const pools=LV.map(l=>sh(l[1]));
const w=x=>x>0?'shifts right':x<0?'shifts left':'does not shift',sym=x=>x==1?'rises':x==-1?'falls':x=='x'?'is ambiguous':'is unchanged';
const nx=()=>{if(ei>=LV[li][2]){li++;ei=0}if(li>=3){done(s);return}ev()};
const ev=()=>{const [txt,dD,dS]=pools[li][ei],base=LV[li][0]/LV[li][2],t0=Date.now(),sg=[[-1,'← Left'],[0,'No shift'],[1,'Right →']],pq=[[1,'↑'],[-1,'↓'],['x','?'],[0,'—']];
el.innerHTML=`<div class="rnd">Level ${li+1} · event ${ei+1}/${LV[li][2]} · score ${Math.round(s)}</div><div class="claim">${txt}</div><div id="gr">${gsvg(0,0,0)}</div>${grp('gd','Demand',sg)}${grp('gs','Supply',sg)}${grp('gp','Price',pq)}${grp('gq','Quantity',pq)}<div id="fb"></div><button class="btn" id="ok">Lock in</button>`;grpInit(el);
$('#ok',el).onclick=function(){const a=['gd','gs','gp','gq'].map(i=>val(el,i));if(a.includes(null)){$('#fb',el).textContent='Pick an answer in every row.';return}
const pe=(!dD&&!dS)?0:(dD*-dS<0?'x':Math.sign(dD-dS)),qe=(!dD&&!dS)?0:(dD*dS<0?'x':Math.sign(dD+dS));
const c=[dD,dS,pe,qe].filter((e,i)=>String(e)==a[i]).length;s+=base*(.75*c/4+(c==4?.25*Math.max(0,1-(Date.now()-t0)/20000):0));
$('#gr',el).innerHTML=gsvg(dD,dS,1);$('#fb',el).innerHTML=`${c==4?'✅ Perfect!':'❌ '+c+'/4 right.'} Demand ${w(dD)}, supply ${w(dS)}; price ${sym(pe)}, quantity ${sym(qe)}.`;this.remove();ei++;nextBtn(el,nx)}};
nx()}};

/* ---------- GAME 3: Price Is Right? ---------- */
G[3]={intro:'<h3>5 days · 1000 pts</h3><p>Each day you sell one product with a <b>hidden</b> demand. You get <b>3 test sales</b> to learn how buyers react, then <b>commit</b> a price. Each day scores your revenue against the best possible. Some days the market changes under you.</p>',
play(el,done){const PR=[['🧂','Salt','An everyday essential.',60,200,6],['👟','Designer shoes','A luxury item.',9000,80,.6],null,['🍕','Pizza','A rival pizzeria just cut its prices by 20%!',500,150,.8,.85,.7],['🍅','Tomatoes','Bumper harvest: the market is flooded with supply!',60,200,3,.6,1.4]];
PR[2]=sh([['📱','Phone charger','Mystery product. No hints today.',800,120,2],['🍚','Rice','Mystery product. No hints today.',90,250,4.5],['🎧','Earbuds','Mystery product. No hints today.',3000,90,.7]])[0];let d=0,tot=0;
const day=()=>{if(d>=5){done(tot);return}const [em,nm,note,p,q,k,pf=1,qf=1]=PR[d],Pm=p*R(.88,1.12)*pf,Qm=q*R(.88,1.12)*qf,ref=Math.round(p*pf/2),Qf=x=>Math.max(0,Qm*(1-Math.pow(x/Pm,k)));
let best=1;for(let x=1;x<Pm;x+=Pm/300)best=Math.max(best,x*Qf(x));let left=3,log=[];
el.innerHTML=`<div class="rnd">Day ${d+1}/5 · score ${Math.round(tot)}</div><div class="food">${em}</div><h3>${nm}</h3><p class="mut">${note} Last week's price: ₹${ref}</p><div>Price: <b>₹<span id="pv">${ref}</span></b></div><input type="range" id="pr" min="${Math.round(ref*.25)}" max="${Math.round(ref*2.4)}" step="${Math.max(1,Math.round(ref/100))}" value="${ref}"><div class="row"><button class="btn ghost" id="test">Test sale (3 left)</button><button class="btn" id="com">Commit price</button></div><div id="log" class="mut"></div><div id="fb"></div>`;
$('#pr',el).oninput=()=>$('#pv',el).textContent=$('#pr',el).value;
$('#test',el).onclick=function(){const P=+$('#pr',el).value,n=Math.round(Qf(P)*(1+R(-.04,.04)));log.push(`₹${P} → ${n} sold (₹${P*n})`);left--;this.textContent=`Test sale (${left} left)`;if(!left)this.disabled=true;$('#log',el).innerHTML=log.join('<br>')};
$('#com',el).onclick=function(){const P=+$('#pr',el).value,rv=P*Math.round(Qf(P)),r=Math.min(1,rv/best),pts=200*r*r;tot+=pts;this.remove();$('#test',el).remove();$('#pr',el).disabled=true;$('#fb',el).innerHTML=`Revenue ₹${Math.round(rv)} · best possible ₹${Math.round(best)} · <b>${Math.round(r*100)}%</b> → +${Math.round(pts)} pts`;d++;nextBtn(el,day,d>=5?'Finish':'Next day →')}};day()}};

/* ---------- GAME 4: Slutsky Lab ---------- */
const DET=[['normal','Fresh fruit','kg'],['normal','Cinema tickets','tickets'],['inferior','Cheap instant noodles','packs'],['inferior','Third-class train tickets','trips'],['giffen','Staple rice (very poor household)','kg'],['giffen','Cheap bread (very poor household)','loaves'],['veblen','Luxury designer watch','units'],['veblen','Premium perfume','bottles']];
const EXP={normal:'Income up → buy more; price up → buy less.',inferior:'Income up → buy LESS; price up → buy less.',giffen:'Income up → buy less; price up → buy MORE (income effect beats substitution).',veblen:'Income up → buy more; price up → buy MORE (status good).'};
G[4]={intro:'<h3>3 rounds · 1000 pts</h3><p><b>A · Best bundle (250)</b> Asha has a budget. Click her best bundle on the line; brighter colours mean more satisfaction.<br><b>B · Split the effect (400)</b> The samosa price falls. Find her new bundle, then slide the compensated budget line until it just touches her old indifference curve.<br><b>C · Goods Detective (350)</b> Classify mystery goods from their data.</p>',
play(el,done){const a=[.4,.5,.6][RI(0,2)],M=120,py=10,p0=6,p1=3,u=(x,y)=>Math.pow(x,a)*Math.pow(y,1-a);
const x0=a*M/p0,y0=(1-a)*M/py,U0=u(x0,y0),x1=a*M/p1,y1=y0,xh=U0*Math.pow(a/(1-a)*py/p1,1-a),yh=xh*(1-a)/a*p1/py,Mc=p1*xh+py*yh;
const W=320,HH=250,X0=30,Y0=225,SX=280/42,SY=205/14,sx=x=>X0+x*SX,sy=y=>Y0-y*SY;
const hm=document.createElement('canvas');hm.width=W;hm.height=HH;const h=hm.getContext('2d'),um=u(42,14);
for(let i=X0;i<X0+280;i+=2)for(let j=Y0-205;j<Y0;j+=2){const t=Math.pow(u((i-X0)/SX,(Y0-j)/SY)/um,.6);h.fillStyle=`hsl(${265-t*215},80%,${14+t*46}%)`;h.fillRect(i,j,2,2)}
h.strokeStyle='#fff8';h.strokeRect(X0,Y0-205,280,205);h.fillStyle='#fff';h.font='11px sans-serif';h.fillText('Samosas →',X0+210,Y0+14);h.fillText('↑ Chai',2,Y0-195);
const cv=document.createElement('canvas');cv.width=W;cv.height=HH;cv.className='cv';const c=cv.getContext('2d');
const draw=f=>{c.drawImage(hm,0,0);f&&f()},line=(m,p,col,w=2,dash=[])=>{c.strokeStyle=col;c.lineWidth=w;c.setLineDash(dash);c.beginPath();c.moveTo(sx(0),sy(m/py));c.lineTo(sx(m/p),sy(0));c.stroke();c.setLineDash([])},
dot=(x,y,col)=>{c.fillStyle=col;c.strokeStyle='#000';c.lineWidth=1.5;c.beginPath();c.arc(sx(x),sy(y),6,0,7);c.fill();c.stroke()},
ind=U=>{c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();let on=0;for(let x=.4;x<=42;x+=.2){const y=Math.pow(U/Math.pow(x,a),1/(1-a));if(y>14){on=0;continue}on?c.lineTo(sx(x),sy(y)):c.moveTo(sx(x),sy(y));on=1}c.stroke()};
const head=(t,p)=>{el.innerHTML=`<div class="rnd">${t}</div><p class="mut">${p}</p>`;el.appendChild(cv)};
let sA=0,sB1=0,sB2=0;
const choose=(title,p,m,max,ghost,next)=>{head(title,`Asha has ₹${m}. Samosa ₹${p}, chai ₹${py}. Click along the white budget line.`);el.insertAdjacentHTML('beforeend','<div id="info" class="mut">Nothing picked yet</div><button class="btn" id="ok">Lock in</button>');let pt=null;
const rd=()=>draw(()=>{ghost&&ghost();line(m,p,'#fff',3);pt&&dot(pt[0],pt[1],'#fbbf24')});rd();
cv.onclick=e=>{const r=cv.getBoundingClientRect(),x=((e.clientX-r.left)*W/r.width-X0)/SX,xx=Math.max(.2,Math.min(m/p-.2,x));pt=[xx,(m-p*xx)/py];rd();$('#info',el).textContent=`${xx.toFixed(1)} samosas, ${pt[1].toFixed(1)} chai`};
$('#ok',el).onclick=function(){if(!pt)return;const xs=a*m/p,ys=(1-a)*m/py,s=max*Math.pow(Math.min(1,u(...pt)/u(xs,ys)),30);rd();dot(xs,ys,'#34d399');this.remove();$('#info',el).innerHTML=`Best bundle: <b>${xs.toFixed(1)} samosas, ${ys.toFixed(1)} chai</b> (green). You earned <b>${Math.round(s)}/${max}</b>.`;nextBtn(el,()=>next(s))}};
const B2=()=>{head('Round B · compensated budget line','Slide the dashed yellow line (same new prices) until it just touches the white curve: the income Asha needs to stay as happy as before.');
el.insertAdjacentHTML('beforeend',`<input type="range" id="m" min="40" max="120" value="120"><div id="info" class="mut">Compensated income: ₹120</div><button class="btn" id="ok">Lock in</button>`);
const rd=()=>draw(()=>{ind(U0);line(M,p1,'#fff6',1.5,[4,4]);line(+$('#m',el).value,p1,'#fbbf24',3);dot(x0,y0,'#22d3ee');dot(x1,y1,'#f472b6')});rd();
$('#m',el).oninput=()=>{rd();$('#info',el).textContent='Compensated income: ₹'+$('#m',el).value};
$('#ok',el).onclick=function(){const m=+$('#m',el).value;sB2=250*Math.max(0,1-Math.abs(m-Mc)/20);draw(()=>{ind(U0);line(Mc,p1,'#34d399',3);dot(x0,y0,'#22d3ee');dot(xh,yh,'#fbbf24');dot(x1,y1,'#f472b6')});this.remove();$('#m',el).disabled=true;
$('#info',el).innerHTML=`Correct income ≈ ₹${Mc.toFixed(0)}. <b>Substitution effect:</b> ${x0.toFixed(1)} → ${xh.toFixed(1)} samosas. <b>Income effect:</b> ${xh.toFixed(1)} → ${x1.toFixed(1)}. +${Math.round(sB2)}/250`;nextBtn(el,C)}};
const C=()=>{const gs=sh(DET).slice(0,5);let i=0,sC=0;const nx=()=>{if(i>=5){done(sA+sB1+sB2+sC);return}const [ty,nm,un]=gs[i],q=RI(8,20),f=()=>R(1.25,1.5),dn=()=>R(.65,.8),inc=ty=='normal'||ty=='veblen'?1:-1,pr=ty=='normal'||ty=='inferior'?-1:1;
const ch=(v,dir)=>Math.max(1,Math.round(v*(dir>0?f():dn())));const qi=ch(q,inc),qp=ch(q,pr);
el.innerHTML=`<div class="rnd">Round C · mystery good ${i+1}/5</div><div class="claim">${nm}</div><div class="stats"><div>Income +25%<b>${q}→${qi}</b>${un}</div><div>Price +20%<b>${q}→${qp}</b>${un}</div></div><p class="mut">Which kind of good is this?</p><div class="opts">${['normal','inferior','giffen','veblen'].map(t=>`<button class="opt" data-t="${t}">${t[0].toUpperCase()+t.slice(1)} good</button>`).join('')}</div><div id="fb"></div>`;
el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const g=b.dataset.t==ty;if(g)sC+=70;el.querySelectorAll('.opt').forEach(x=>x.onclick=null);b.classList.add(g?'ok':'bad');$('#fb',el).innerHTML=(g?'✅ ':'❌ It is a <b>'+ty+'</b> good. ')+EXP[ty];i++;nextBtn(el,nx,i>=5?'Finish':'Next →')})};nx()};
choose('Round A · Best bundle',p0,M,250,null,s=>{sA=s;choose('Round B · New bundle',p1,M,150,()=>line(M,p0,'#fff6',1.5,[4,4]),s2=>{sB1=s2;B2()})})}};
