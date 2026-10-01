/* ---------- Data (one source of truth; pages are generated from it) ---------- */
const SIGNS = [
  { id:"aries", name:"Aries", glyph:"♈", dates:"Mar 21 – Apr 19", element:"Fire", modality:"Cardinal", ruler:"Mars",
    blurb:"Bold, direct and quick to begin. Aries is the first sign of the zodiac, and tradition links it with courage and a love of fresh starts." },
  { id:"taurus", name:"Taurus", glyph:"♉", dates:"Apr 20 – May 20", element:"Earth", modality:"Fixed", ruler:"Venus",
    blurb:"Steady, patient and loyal. Taurus is traditionally tied to comfort, good food and things built to last." },
  { id:"gemini", name:"Gemini", glyph:"♊", dates:"May 21 – Jun 20", element:"Air", modality:"Mutable", ruler:"Mercury",
    blurb:"Curious, witty and always talking. Gemini is linked with quick thinking, learning and variety." },
  { id:"cancer", name:"Cancer", glyph:"♋", dates:"Jun 21 – Jul 22", element:"Water", modality:"Cardinal", ruler:"Moon",
    blurb:"Caring, intuitive and protective. Cancer is traditionally associated with home, family and deep feeling." },
  { id:"leo", name:"Leo", glyph:"♌", dates:"Jul 23 – Aug 22", element:"Fire", modality:"Fixed", ruler:"Sun",
    blurb:"Warm, generous and confident. Leo is linked with creativity, leadership and a love of being seen." },
  { id:"virgo", name:"Virgo", glyph:"♍", dates:"Aug 23 – Sep 22", element:"Earth", modality:"Mutable", ruler:"Mercury",
    blurb:"Careful, practical and helpful. Virgo is traditionally tied to detail, service and self-improvement." },
  { id:"libra", name:"Libra", glyph:"♎", dates:"Sep 23 – Oct 22", element:"Air", modality:"Cardinal", ruler:"Venus",
    blurb:"Fair-minded, charming and social. Libra is linked with balance, beauty and harmony in relationships." },
  { id:"scorpio", name:"Scorpio", glyph:"♏", dates:"Oct 23 – Nov 21", element:"Water", modality:"Fixed", ruler:"Pluto (traditionally Mars)",
    blurb:"Intense, private and determined. Scorpio is traditionally associated with depth, loyalty and transformation." },
  { id:"sagittarius", name:"Sagittarius", glyph:"♐", dates:"Nov 22 – Dec 21", element:"Fire", modality:"Mutable", ruler:"Jupiter",
    blurb:"Adventurous, honest and optimistic. Sagittarius is linked with travel, big ideas and a need for freedom." },
  { id:"capricorn", name:"Capricorn", glyph:"♑", dates:"Dec 22 – Jan 19", element:"Earth", modality:"Cardinal", ruler:"Saturn",
    blurb:"Disciplined, ambitious and dependable. Capricorn is traditionally tied to goals, structure and long-term effort." },
  { id:"aquarius", name:"Aquarius", glyph:"♒", dates:"Jan 20 – Feb 18", element:"Air", modality:"Fixed", ruler:"Uranus (traditionally Saturn)",
    blurb:"Independent, inventive and original. Aquarius is linked with ideas, community and doing things differently." },
  { id:"pisces", name:"Pisces", glyph:"♓", dates:"Feb 19 – Mar 20", element:"Water", modality:"Mutable", ruler:"Neptune (traditionally Jupiter)",
    blurb:"Gentle, imaginative and empathetic. Pisces is traditionally associated with dreams, art and compassion." }
];
SIGNS.forEach(s => { s.glyph += "\uFE0E"; }); // force text glyphs, not purple emoji
const ELEMENT_COLOR = { Fire:"#ff9a6b", Earth:"#9bd28a", Air:"#8fd3f4", Water:"#9aa8ff" };

/* ---------- Birthday -> sign ---------- */
// Each sign starts on this month*100+day (Capricorn wraps across the new year).
const STARTS = [[120,"aquarius"],[219,"pisces"],[321,"aries"],[420,"taurus"],[521,"gemini"],[621,"cancer"],
                [723,"leo"],[823,"virgo"],[923,"libra"],[1023,"scorpio"],[1122,"sagittarius"],[1222,"capricorn"]];
function signFor(month, day){
  const v = month*100 + day;
  let id = "capricorn"; // covers Jan 1 – Jan 19
  for (const [start, sid] of STARTS) if (v >= start) id = sid;
  return SIGNS.find(s => s.id === id);
}

/* ---------- Hook content: one-liners + simplified constellations ---------- */
const LINES = {
  aries:"Starts first, asks questions later.", taurus:"Slow to decide, impossible to move.",
  gemini:"Two ideas at once, and both are good.", cancer:"Feels everything, forgets nothing.",
  leo:"Walks in and the room rearranges.", virgo:"Notices the detail you missed.",
  libra:"Weighs both sides, then picks the nicer one.", scorpio:"Says little, knows a lot.",
  sagittarius:"Already packing for the next place.", capricorn:"Plays the long game and wins it.",
  aquarius:"Never followed the crowd, never will.", pisces:"Lives half in the room, half in a dream."
};
// Simplified shapes (0-100 box), not exact star charts.
const TINT = {Fire:"rgba(255,140,80,.24)",Earth:"rgba(110,180,120,.18)",Air:"rgba(120,195,240,.20)",Water:"rgba(110,120,255,.26)"};
const STAR = {aries:"Hamal",taurus:"Aldebaran",gemini:"Pollux",cancer:"Al Tarf",leo:"Regulus",virgo:"Spica",libra:"Zubeneschamali",scorpio:"Antares",sagittarius:"Kaus Australis",capricorn:"Deneb Algedi",aquarius:"Sadalsuud",pisces:"Eta Piscium"};
const CONST = {
  aries:[[[8,62],[38,48],[62,40],[88,28]]],
  taurus:[[[10,22],[32,48],[52,56],[72,46],[92,18]],[[52,56],[60,82]]],
  gemini:[[[22,12],[26,42],[20,70],[28,92]],[[62,14],[58,44],[66,72],[60,92]],[[26,42],[58,44]]],
  cancer:[[[50,50],[30,82]],[[50,50],[72,78]],[[50,50],[46,22],[68,14]]],
  leo:[[[18,70],[28,44],[46,32],[60,14],[74,24],[62,36],[46,32]],[[62,36],[86,56],[58,70],[46,32]]],
  virgo:[[[12,30],[34,40],[52,34],[70,48],[88,70]],[[52,34],[48,66],[36,88]],[[70,48],[56,76]]],
  libra:[[[50,14],[20,50],[50,80],[80,50],[50,14]],[[20,50],[80,50]]],
  scorpio:[[[14,12],[22,30],[30,46],[38,62],[56,74],[72,70],[84,54],[78,40]]],
  sagittarius:[[[30,40],[52,30],[66,48],[58,70],[36,66],[30,40]],[[52,30],[56,12]],[[66,48],[88,40]]],
  capricorn:[[[10,22],[40,34],[78,30],[90,44],[62,78],[36,70],[10,22]]],
  aquarius:[[[10,34],[32,26],[52,36],[72,28],[90,38]],[[14,66],[36,58],[56,68],[76,60],[92,70]]],
  pisces:[[[10,36],[30,30],[50,44],[70,38],[90,50]],[[90,50],[76,70],[56,80],[40,74],[52,44]]]
};

/* ---------- Wheel (turns to the chosen sign) ---------- */
const NS = "http://www.w3.org/2000/svg";
const wheel = document.getElementById("wheel");
const polar = (r, deg) => { const a = (deg-90)*Math.PI/180; return [200 + r*Math.cos(a), 200 + r*Math.sin(a)]; };
const mk = (tag, at) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };
function segPath(i){
  const a0 = i*30, a1 = a0+30, R = 188, r = 112;
  const [x0,y0] = polar(R,a0), [x1,y1] = polar(R,a1), [x2,y2] = polar(r,a1), [x3,y3] = polar(r,a0);
  return `M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 0 0 ${x3} ${y3}Z`;
}
let spinEl, ang = 0, target = null;
function render(){ spinEl.setAttribute("transform", `rotate(${ang} 200 200)`); }
let vel = 0, landing = false, buzz = false, fxPlan = {n:34, user:false};
function spinTo(i, userAction){
  const c = i*30 + 15;
  target = -c + 360*Math.round((ang + c)/360);
  landing = true; buzz = !!userAction;
  if (reduced()){ ang = target; vel = 0; render(); landed(); }
}
function landed(){
  landing = false;
  const p = document.querySelector(".pulse");
  if (p){ p.classList.remove("go"); void p.offsetWidth; p.classList.add("go"); }
  if (buzz && !reduced() && navigator.vibrate) navigator.vibrate(12);
  if (fxPlan.user){
    const w = document.querySelector(".wheel-wrap"), r = w.getBoundingClientRect();
    burstFrom(r.bottom > 0 && r.top < innerHeight*.9 ? w : (document.querySelector(".plate h2") || w), fxPlan.n);
  }
}
function tick(){
  if (target !== null){
    vel = (vel + (target-ang)*.014)*.84; ang += vel;
    if (Math.abs(target-ang) < .05 && Math.abs(vel) < .03){ ang = target; vel = 0; if (landing) landed(); }
  } else if (!reduced()) ang += .03;
  render(); requestAnimationFrame(tick);
}
function buildWheel(){
  spinEl = mk("g", {});
  [196,104].forEach(r => spinEl.appendChild(mk("circle", {cx:200, cy:200, r, class:"ring"})));
  for (let i=0; i<72; i++){
    const [x0,y0] = polar(196, i*5), [x1,y1] = polar(i%6===0 ? 184 : 190, i*5);
    spinEl.appendChild(mk("line", {x1:x0, y1:y0, x2:x1, y2:y1, class:"tick"}));
  }
  SIGNS.forEach((s,i) => {
    const g = mk("g", {class:"seg", tabindex:0, role:"button", "aria-label":s.name, "data-id":s.id});
    const [tx,ty] = polar(150, i*30+15);
    const t = mk("text", {x:tx, y:ty}); t.textContent = s.glyph;
    g.append(mk("path", {d:segPath(i)}), t);
    g.addEventListener("click", () => show(s.id, true));
    g.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" "){ e.preventDefault(); show(s.id, true); } });
    spinEl.appendChild(g);
  });
  wheel.append(spinEl, mk("path", {d:"M200 12L191 -6L209 -6Z", class:"ptr"}));
  const pulse = document.createElement("div"); pulse.className = "pulse"; pulse.setAttribute("aria-hidden","true"); wheel.parentNode.appendChild(pulse);
  requestAnimationFrame(tick);
}

/* ---------- Chips ---------- */
const chips = document.getElementById("chips");
SIGNS.forEach(s => {
  const b = document.createElement("button");
  b.className = "chip"; b.dataset.id = s.id; b.type = "button";
  b.innerHTML = `<b>${s.glyph}</b>${s.name}`;
  b.addEventListener("click", () => show(s.id, true));
  chips.appendChild(b);
});

/* ---------- Result ---------- */
const result = document.getElementById("result");
function constellation(id){
  let h = '<svg class="const" viewBox="0 0 100 100" aria-hidden="true">', n = 0;
  let seed = SIGNS.findIndex(x => x.id === id)*97 + 13;
  const rnd = () => (seed = seed*16807 % 2147483647)/2147483647;
  for (let k=0; k<16; k++) h += `<circle class="bg" cx="${(rnd()*96+2).toFixed(1)}" cy="${(rnd()*96+2).toFixed(1)}" r="${(rnd()*.5+.3).toFixed(2)}" style="animation-delay:${(rnd()*3).toFixed(1)}s"/>`;
  CONST[id].forEach((ch,k) => { h += `<polyline pathLength="1" style="animation-delay:${.6+k*.4}s" points="${ch.join(" ")}"/>`; });
  CONST[id].forEach((ch,k) => ch.forEach(p => { h += `<circle cx="${p[0]}" cy="${p[1]}" r="1.9" style="animation-delay:${.5+(n++)*.06}s"/>`; }));
  return h + "</svg>";
}
function daysUntil(mo, d){
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const next = new Date(now.getFullYear(), mo-1, d);
  if (next < today) next.setFullYear(next.getFullYear()+1);
  return Math.round((next - today)/864e5);
}
function details(id){
  const p = PROFILES[id], b = (h,t,i) => `<div${i ? ` id="d-${i}"` : ""}><h3>${h}</h3><p>${t}</p></div>`;
  return `<div class="detail">${b("Personality",p.pers,"pers")}${b("Strengths",p.str,"str")}${b("Challenges",p.chal)}${b("In love",p.love,"love")}${b("As a friend",p.friend)}${b("At work",p.career,"career")}${b("How they talk",p.talk)}${b("Likes",p.likes)}${b("Dislikes",p.dislikes)}${b("Colour, stone, day",p.assoc)}${b("Mythology",p.myth)}${b("Born under it",p.fam)}</div>`;
}
function show(id, scroll, birth){
  const s = SIGNS.find(x => x.id === id), i = SIGNS.indexOf(s);
  document.querySelectorAll(".seg,.chip").forEach(el => el.classList.toggle("on", el.dataset.id === id));
  fxPlan = {n: birth && daysUntil(birth.mo, birth.d) === 0 ? 70 : 34, user: !!scroll};
  spinTo(i, !!scroll);
  document.documentElement.style.setProperty("--tint", TINT[s.element]);
  history.replaceState(null, "", "#" + id);
  if (typeof cA !== "undefined" && !cA.dataset.manual){ cA.value = id; if (cB.value) renderCompat(); }
  let bday = "";
  if (birth){ const n = daysUntil(birth.mo, birth.d);
    bday = `<p class="bday">${n===0 ? "Happy birthday! The sky is yours today." : n===1 ? "Your birthday is tomorrow." : `Your birthday is in ${n} days.`}</p>`; }
  result.hidden = false;
  result.innerHTML = `<article class="plate">
    ${constellation(id)}
    <div>
      <h2>${s.name}<span aria-hidden="true">${s.glyph}</span></h2>
      <p class="dates">${s.dates}</p>
      <p class="star">Brightest star: ${STAR[id]}. The outline is simplified.</p>
      <p class="tagline">${LINES[id]}</p>
      <p class="blurb">${s.blurb}</p>
      <nav class="jumps" aria-label="Jump to a section"><a href="#today">Today</a><a href="#d-pers">Personality</a><a href="#d-str">Strengths</a><a href="#d-love">Love</a><a href="#d-career">Career</a><a href="#compat">Compatibility</a></nav>
      ${today(id)}
      <dl class="facts">
        <div><dt>Element</dt><dd>${s.element}</dd></div>
        <div><dt>Modality</dt><dd>${s.modality}</dd></div>
        <div><dt>Ruling planet</dt><dd>${s.ruler}</dd></div>
        <div><dt>Symbol</dt><dd>${s.glyph} ${SYM[id]}</dd></div>
      </dl>
      ${bday}
      <div class="actions"><button type="button" class="share" id="shareBtn">Share my sign</button>${birth ? '<button type="button" class="share" id="calBtn">Remind me before my birthday</button>' : ""}</div>
    </div>${details(id)}</article>`;
  document.getElementById("shareBtn").addEventListener("click", async e => {
    const text = `I'm ${s.name} ${s.glyph}: "${LINES[id]}" Which sky were you born under?`;
    try { if (navigator.share && /^https?:$/.test(location.protocol)) await navigator.share({ text, url: location.href });
          else { await navigator.clipboard.writeText(text + " " + location.href); e.target.textContent = "Copied"; } }
    catch (x) { if (!x || x.name !== "AbortError") e.target.textContent = "Could not share. Copy the link from the address bar."; }
  });
  const cal = document.getElementById("calBtn");
  if (cal) cal.addEventListener("click", () => { downloadReminder(birth.mo, birth.d, s); cal.textContent = "Open the downloaded file to add it"; });
  result.querySelectorAll(".jumps a").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(a.getAttribute("href")).scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  }));
  if (scroll) setTimeout(() => result.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }), reduced() ? 0 : 500);
}

/* ---------- Birthday form (month + day only) ---------- */
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS=[31,29,31,30,31,30,31,31,30,31,30,31];
const form=document.getElementById("dobForm"), bm=document.getElementById("bm"), bd=document.getElementById("bd"), err=document.getElementById("dobError");
bm.innerHTML='<option value="" disabled selected>Month</option>'+MONTHS.map((m,i)=>`<option value="${i+1}">${m}</option>`).join("");
function fillDays(){
  const max = bm.value ? DAYS[bm.value-1] : 31, keep = bd.value;
  bd.innerHTML='<option value="" disabled selected>Day</option>'+Array.from({length:max},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join("");
  if (keep && +keep <= max) bd.value = keep;
}
bm.addEventListener("change", fillDays); fillDays();
form.addEventListener("submit", e => {
  e.preventDefault();
  if (!bm.value || !bd.value){ err.textContent = "Choose your birth month and day to find your sign."; err.hidden = false; return; }
  err.hidden = true;
  const mo = +bm.value, d = +bd.value;
  show(signFor(mo,d).id, true, {mo, d});
  if (rem.checked){ try { localStorage.setItem("celestia.bday", JSON.stringify({mo, d})); } catch (_) {} }
});

/* ---------- Stars + motion preference ---------- */
const cv = document.getElementById("stars"), ctx = cv.getContext("2d");
const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const toggle = document.getElementById("motionToggle");
let shoot = null, manualCalm = false, stars = [], raf;
const reduced = () => manualCalm || mq.matches;

function resize(){
  cv.width = innerWidth; cv.height = innerHeight;
  const n = Math.min(140, Math.floor(innerWidth*innerHeight/9000));
  stars = Array.from({length:n}, () => ({ x:Math.random()*cv.width, y:Math.random()*cv.height,
    r:Math.random()*1.3+.3, p:Math.random()*6.28, s:Math.random()*.02+.005 }));
  draw(0);
}
function draw(t){
  ctx.clearRect(0,0,cv.width,cv.height);
  for (const s of stars){
    if (!reduced()){ s.x += s.r*.012; if (s.x > cv.width+2) s.x = -2; }
    const a = reduced() ? .7 : .35 + .5*Math.abs(Math.sin(s.p + t*s.s*.06));
    ctx.fillStyle = `rgba(234,241,255,${a})`;
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.28); ctx.fill();
  }
  if (!reduced()){
    if (!shoot && Math.random() < .0006) shoot = {x:cv.width*(.3+Math.random()*.7), y:cv.height*Math.random()*.4, l:0};
    if (shoot){
      const vx = -9, vy = 4; shoot.x += vx; shoot.y += vy; shoot.l++;
      const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x-vx*5, shoot.y-vy*5);
      g.addColorStop(0,"rgba(255,235,190,.9)"); g.addColorStop(1,"rgba(255,235,190,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x-vx*5, shoot.y-vy*5); ctx.stroke();
      if (shoot.l > 45) shoot = null;
    }
  }
}
function loop(t){ draw(t); raf = reduced() ? null : requestAnimationFrame(loop); }
function applyMotion(){
  document.body.classList.toggle("calm", reduced());
  cancelAnimationFrame(raf); raf = null;
  if (reduced()) draw(0); else raf = requestAnimationFrame(loop);
}
toggle.addEventListener("click", () => {
  manualCalm = !manualCalm;
  toggle.setAttribute("aria-pressed", manualCalm);
  applyMotion();
});
mq.addEventListener("change", applyMotion);
addEventListener("resize", () => { resize(); applyMotion(); });

buildWheel(); resize(); applyMotion();

/* Open a sign straight from a shared link (#leo) */
{ const h = location.hash.slice(1); if (SIGNS.some(x => x.id === h)) show(h, false); }

/* Optional: remember the birthday on this device and greet them when they return */
const rem = document.getElementById("rem"), welcome = document.getElementById("welcome");
function savedBirthday(){
  try { const v = JSON.parse(localStorage.getItem("celestia.bday"));
    return v && v.mo >= 1 && v.mo <= 12 && v.d >= 1 && v.d <= DAYS[v.mo-1] ? v : null; } catch (_) { return null; }
}
function greet(b){
  const sg = signFor(b.mo, b.d), n = daysUntil(b.mo, b.d);
  welcome.hidden = false;
  welcome.textContent = `Welcome back. You are ${sg.name} ${sg.glyph}, and ${n === 0 ? "today is your birthday" : n === 1 ? "your birthday is tomorrow" : "your birthday is in " + n + " days"}. `;
  const f = document.createElement("button");
  f.type = "button"; f.className = "quiet"; f.textContent = "Forget my birthday";
  f.addEventListener("click", () => { try { localStorage.removeItem("celestia.bday"); } catch (_) {} welcome.hidden = true; rem.checked = false; });
  welcome.appendChild(f);
}
{ const b0 = savedBirthday();
  if (b0){
    bm.value = b0.mo; fillDays(); bd.value = b0.d; rem.checked = true; greet(b0);
    if (!location.hash) show(signFor(b0.mo, b0.d).id, false, b0);
  } }