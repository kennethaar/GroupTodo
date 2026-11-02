/* The other meetings on the same day page that share some of its time. One
   with no end counts as half an hour, as the reminders do. */
const meetLive = b => b.state !== "DONE" && b.state !== "CANCELLED" && !/^#meeting Cancelled:/i.test(b.title);
