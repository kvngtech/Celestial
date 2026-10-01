/* Stardust: gold sparkles drawn in code. No files to download, and the loop only runs while sparkles are alive. */
const fxCv = document.getElementById("fx"), fxCtx = fxCv.getContext("2d");
let fxP = [], fxRaf = null;
function fxSize(){
  const d = Math.min(devicePixelRatio || 1, 2);
  fxCv.width = innerWidth*d; fxCv.height = innerHeight*d; fxCtx.setTransform(d,0,0,d,0,0);
}
fxSize(); addEventListener("resize", fxSize);
function fxAdd(x, y, n, speed, up){
  for (let i=0; i<n; i++){
    const a = Math.random()*6.283, v = (Math.random()*.6 + .4)*speed;
    fxP.push({x, y, vx:Math.cos(a)*v, vy:Math.sin(a)*v - up, r:Math.random()*1.8 + .8, life:0, max:50 + Math.random()*30, tw:Math.random()*6});
  }
  if (!fxRaf) fxRaf = requestAnimationFrame(fxLoop);
}
function fxLoop(){
  fxCtx.clearRect(0, 0, innerWidth, innerHeight);
  fxP = fxP.filter(p => p.life < p.max);
  for (const p of fxP){
    p.life++; p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy = p.vy*.97 + .03;
    const k = 1 - p.life/p.max, tw = .6 + .4*Math.sin(p.life*.5 + p.tw), s = p.r*2.2*(.5 + k);
    fxCtx.globalAlpha = Math.max(0, k)*tw;
    fxCtx.fillStyle = p.life % 7 < 3 ? "#fff3c9" : "#ecc97a";
    fxCtx.beginPath();
    fxCtx.moveTo(p.x, p.y-s); fxCtx.lineTo(p.x+s*.28, p.y-s*.28); fxCtx.lineTo(p.x+s, p.y); fxCtx.lineTo(p.x+s*.28, p.y+s*.28);
    fxCtx.lineTo(p.x, p.y+s); fxCtx.lineTo(p.x-s*.28, p.y+s*.28); fxCtx.lineTo(p.x-s, p.y); fxCtx.lineTo(p.x-s*.28, p.y-s*.28);
    fxCtx.closePath(); fxCtx.fill();
  }
  fxCtx.globalAlpha = 1;
  if (fxP.length) fxRaf = requestAnimationFrame(fxLoop);
  else { fxCtx.clearRect(0, 0, innerWidth, innerHeight); fxRaf = null; }
}
function burstFrom(el, n){
  if (reduced()) return;
  const r = el.getBoundingClientRect();
  fxAdd(r.left + r.width/2, r.top + r.height/2, n, 5.5, 0);
}
function sparkLine(el, n){
  if (reduced()) return;
  const r = el.getBoundingClientRect();
  for (let i=0; i<n; i++) fxAdd(r.left + Math.random()*r.width, r.top + r.height/2, 1, 1.6, .8);
}