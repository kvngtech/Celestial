/* Daily reading: no server needed. Same text for everyone on a given day, changes at local midnight. */
const TODAY = {
Fire:{
day:["Your energy runs high today. Spend it on the one thing you keep putting off.","A bold move beats a perfect plan today.","Someone may follow your lead. Make it a good one.","Slow down for one conversation. It will pay off more than the rush.","Start something small today, even if it is only a list.","Your confidence is easy to read today. Use it kindly.","Say yes to the invitation that scares you a little."],
love:["Be direct with someone you like. Keep it light and honest.","Warmth wins over drama today.","A shared laugh does more than a grand gesture.","Give your partner your full attention for ten minutes.","An old spark may return. Let it show up before judging it.","Say what you appreciate out loud.","Patience with someone close is today's quiet act of love."],
work:["Take the lead on a task others are avoiding.","Finish what you started before opening something new.","A quick decision helps the whole team today.","Share credit and you gain more than you give.","Your pitch lands best if you keep it short.","Competition is friendly today. Enjoy it.","Pick one goal and give it your best hour."]},
Earth:{
day:["Steady steps beat big leaps today.","Tidy one corner of your life and the rest feels lighter.","Rest is productive today. Take a proper break.","A familiar routine gives you the calm you need.","Look after the basics: food, water, sleep.","Trust the slow plan. It is working.","Something practical you fix today keeps helping you."],
love:["Show care through something useful, like a meal or a favour.","Consistency says more than words today.","Make time for someone you have not seen in a while.","Small comforts bring you closer to someone.","Listen first, then offer help if it is wanted.","A calm evening together beats a busy night out.","Loyalty is its own kind of romance."],
work:["Careful planning pays off. Check the details once more.","Do the unglamorous task well and it gets noticed.","A steady pace gets you further than a rush.","Sort your list and cross off the easy wins first.","Ask for what you need in clear, practical terms.","Choose quality over speed in what you hand in.","Someone leans on your reliability today."]},
Air:{
day:["Your mind is quick today. Write down the good ideas.","A conversation sparks something new.","Step back and look at the problem from another side.","Message someone you have been meaning to reach.","Learn one new thing, however small.","Say less in the first minute and listen more.","A change of scene clears your head."],
love:["Talk it through. Honest words bring you closer today.","Flirt a little. Play suits you.","Give the people you love some space and some attention.","A message at the right moment means a lot.","Share an idea or a joke with someone close.","Curiosity about another person is attractive today.","Be clear about what you want from a connection."],
work:["Team conversations go well. Speak up early.","A fresh idea gets a good hearing.","Keep your notes tidy. You will need them later.","Network gently. One good contact is enough.","Explain things simply and people follow you.","Close a few tabs, on screen and in your head.","Collaboration beats going it alone today."]},
Water:{
day:["Trust your gut, especially about people.","You feel things deeply today. Give yourself time to process.","A quiet moment with music or water helps.","Creativity flows when you stop judging it.","Protect your energy and say no where you need to.","An old memory returns. Smile at it and move on.","Be gentle with yourself first, then with others."],
love:["Open up a little more than usual.","A tender gesture lands better than a clever line.","Pay attention to what is left unsaid between you.","Reassure someone who needs it.","Spend time with people who make you feel safe.","Forgive something small and feel lighter.","Romance feels natural today. Keep it simple."],
work:["Your read on a colleague is worth listening to.","Care about how people feel, not only about the task.","Creative tasks go well. Give them the first slot.","Try not to take criticism personally today.","Support a teammate quietly. It gets noticed.","Work somewhere calm if you can.","Follow your instinct on which task comes first."]}
};
const LUCKY_COLOURS=["teal","gold","coral","indigo","silver","green","rose","amber"];
function today(id){
  const si = SIGNS.findIndex(s => s.id === id), el = SIGNS[si].element, now = new Date();
  const dayNum = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())/864e5);
  const pick = (k, c) => TODAY[el][k][(dayNum + si*3 + c*2) % 7];
  const date = now.toLocaleDateString(undefined, {weekday:"long", day:"numeric", month:"long"});
  const cell = (h, t) => `<div><h4>${h}</h4><p>${t}</p></div>`;
  return `<section class="today" id="today" aria-label="Today's reading">
    <h3>Today, ${date}</h3>
    <div class="tgrid">${cell("The day",pick("day",0))}${cell("Love",pick("love",1))}${cell("Work",pick("work",2))}</div>
    <p class="lucky">Lucky number ${((dayNum*7 + si*13) % 99) + 1}. Lucky colour ${LUCKY_COLOURS[(dayNum + si*5) % 8]}.</p>
    <p class="note">For entertainment only, not a prediction. A new reading appears tomorrow.</p>
  </section>`;
}