/* Compatibility: traditional aspects (distance on the wheel) + element + modality rules. */
const CATS=[["Love","love"],["Friendship","friend"],["Communication","talk"],["Emotional connection","emo"],["Adventure","adv"],["Independence","ind"]];
const EL={Fire:{love:4,friend:4,talk:3,emo:3,adv:5,ind:5},Earth:{love:4,friend:4,talk:3,emo:3,adv:2,ind:3},Air:{love:3,friend:5,talk:5,emo:2,adv:4,ind:5},Water:{love:5,friend:3,talk:3,emo:5,adv:3,ind:2}};
const GIFT={Fire:"spark and courage",Earth:"steadiness and follow-through",Air:"ideas and perspective",Water:"empathy and intuition"};
const ASPECT=[["Same sign","They mirror each other. That feels familiar and can magnify shared flaws."],["Neighbours","Side by side on the wheel, they have little in common by nature and learn from the difference."],["Sextile","A friendly aspect. They support each other with little effort."],["Square","A tense aspect. Friction pushes both to grow if they stay patient."],["Trine","A flowing aspect, traditionally the easiest match, since they share an element."],["Quincunx","An awkward fit. They need to adjust to each other on purpose."],["Opposites","Opposite signs are strongly drawn to each other, each holding what the other lacks."]];
const BONUS=[0,-1,1,-1,1,-1,1];
const MOD={Cardinal:"Both like to lead, so who decides can become a contest.",Fixed:"Both dig in, so disagreements can stall.",Mutable:"Both adapt, so plans can drift until someone commits."};
const SAY={
love:["Romance needs deliberate effort.","Romance can grow with patience.","Romance comes easily and feels natural."],
friend:["Friendship needs shared ground to hold.","A friendship that grows through shared plans.","An easy, loyal friendship."],
talk:["They may talk past each other at first.","Conversation works once each learns the other's style.","Talk flows easily and rarely runs dry."],
emo:["Feelings may stay on the surface unless someone opens up.","Emotional trust builds steadily over time.","A deep, intuitive emotional bond."],
adv:["Different appetites for risk and novelty.","Happy to explore together in moderation.","Always ready for the next trip or new idea."],
ind:["They may lean on each other more than they admit.","They share space and freedom in a balanced way.","Each keeps their own life and respects the other's freedom."]};

function compare(a,b){
  const i=SIGNS.indexOf(a), j=SIGNS.indexOf(b), diff=Math.abs(i-j), d=Math.min(diff,12-diff);
  const scores={};
  CATS.forEach(([,k],n)=>{
    let v=Math.round((EL[a.element][k]+EL[b.element][k])/2);
    if(n<4) v+=BONUS[d];
    scores[k]=Math.max(1,Math.min(5,v));
  });
  const avg=CATS.reduce((t,[,k])=>t+scores[k],0)/CATS.length;
  const clash=(a.element==="Fire"&&b.element==="Water")||(a.element==="Water"&&b.element==="Fire")||(a.element==="Earth"&&b.element==="Air")||(a.element==="Air"&&b.element==="Earth");
  const ch=[];
  if(a.modality===b.modality) ch.push(MOD[a.modality]);
  else ch.push(`Their rhythms differ (${a.modality} and ${b.modality}), which balances things once each respects the other's pace.`);
  if(clash) ch.push(`${a.element} and ${b.element} see the world differently, so patience matters.`);
  if(d===3||d===5) ch.push("The aspect between them asks for deliberate effort.");
  const comp=a.element===b.element
    ? `Both bring ${GIFT[a.element]}. Together that doubles the strengths and the blind spots.`
    : `${a.name} brings ${GIFT[a.element]}. ${b.name} brings ${GIFT[b.element]}.`;
  return {d,scores,avg,ch:ch.join(" "),comp,verdict:avg>=4?"Flows easily":avg>=3?"Balanced":"Takes effort"};
}

const cA=document.getElementById("cA"), cB=document.getElementById("cB"), cOut=document.getElementById("cOut");
[cA,cB].forEach(sel=>{
  sel.innerHTML='<option value="" disabled selected>Choose a sign</option>'+SIGNS.map(s=>`<option value="${s.id}">${s.glyph} ${s.name}</option>`).join("");
  sel.addEventListener("change",renderCompat);
});
cA.addEventListener("change",()=>{cA.dataset.manual="1";});
function renderCompat(){
  if(!cA.value||!cB.value){cOut.innerHTML='<p class="sub">Choose two signs to compare.</p>';return;}
  const a=SIGNS.find(s=>s.id===cA.value), b=SIGNS.find(s=>s.id===cB.value), r=compare(a,b);
  const rows=CATS.map(([label,k],n)=>{
    const v=r.scores[k], lvl=v<=2?0:v===3?1:2;
    const dots=[0,1,2,3,4].map(x=>`<i class="${x<v?"f":""}" style="animation-delay:${n*.12+x*.05}s"></i>`).join("");
    return `<div class="crow"><h3>${label}</h3><span class="meter" role="img" aria-label="${v} out of 5">${dots}</span><p>${SAY[k][lvl]}</p></div>`;
  }).join("");
  cOut.innerHTML=`<div class="cres">
    <p class="cglyphs" aria-hidden="true"><b class="ga">${a.glyph}</b><i class="link"></i><b class="gb">${b.glyph}</b></p>
    <h3 class="cverdict">${a.name} and ${b.name}: ${r.verdict}</h3>
    <p class="casp"><b>${ASPECT[r.d][0]}.</b> ${ASPECT[r.d][1]}</p>
    <div class="cgrid">${rows}</div>
    <div class="cnote"><h3>Possible challenges</h3><p>${r.ch}</p></div>
    <div class="cnote"><h3>How they complement each other</h3><p>${r.comp}</p></div>
  </div>`;
  if (r.avg >= 4) setTimeout(() => {
    const l = cOut.querySelector(".link"), rc = cOut.getBoundingClientRect();
    if (l && rc.top < innerHeight && rc.bottom > 0) sparkLine(l, 28);
  }, 1300);
}

/* Search / explore */
const q=document.getElementById("q"), none=document.getElementById("none");
q.addEventListener("input",()=>{
  const v=q.value.trim().toLowerCase(); let n=0;
  document.querySelectorAll("#chips .chip").forEach(c=>{
    const s=SIGNS.find(x=>x.id===c.dataset.id);
    const hit=!v||[s.name,s.element,s.modality,s.ruler,s.dates].join(" ").toLowerCase().includes(v);
    c.hidden=!hit; if(hit)n++;
  });
  none.hidden=n>0; none.textContent=`No sign matches "${q.value.trim()}". Try a name, an element like Fire, or a planet like Venus.`;
});

renderCompat();