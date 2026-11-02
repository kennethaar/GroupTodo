const addedDate = b => dateIn(blockProp(b, "Added"));
const blockAge  = b => { const a = addedDate(b); return a ? dateDiffDays(a, todayISO()) : null; };
