/* Birthday reminders: the calendar file is built on the device. Nothing is sent anywhere. */
function downloadReminder(mo, d, sign){
  const now = new Date(), pad = n => String(n).padStart(2, "0");
  const stamp = now.getUTCFullYear() + pad(now.getUTCMonth()+1) + pad(now.getUTCDate()) + "T" + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + "Z";
  const leap = mo === 2 && d === 29;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateFor = yr => leap ? new Date(yr, 2, 0) : new Date(yr, mo-1, d); // leap birthdays fall on the last day of Feb in other years
  let y = now.getFullYear(), start = dateFor(y);
  if (start < today) start = dateFor(++y);
  const ymd = dt => dt.getFullYear() + pad(dt.getMonth()+1) + pad(dt.getDate());
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate()+1);
  const alarm = (trigger, text) => ["BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + text, "TRIGGER:" + trigger, "END:VALARM"];
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Celestia//Birthday//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    "UID:birthday-" + mo + "-" + d + "@celestia", "DTSTAMP:" + stamp,
    "DTSTART;VALUE=DATE:" + ymd(start), "DTEND;VALUE=DATE:" + ymd(end),
    leap ? "RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1" : "RRULE:FREQ=YEARLY",
    "SUMMARY:My birthday (Celestia)", "DESCRIPTION:Your sign is " + sign.name + ".",
    ...alarm("-P6DT15H", "One week until your birthday"),
    ...alarm("-PT15H", "Your birthday is tomorrow"),
    ...alarm("PT9H", "Happy birthday! The sky is yours today."),
    "END:VEVENT", "END:VCALENDAR"
  ];
  const blob = new Blob([lines.join("\r\n") + "\r\n"], {type:"text/calendar;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "birthday-reminders.ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}