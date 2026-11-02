/* The Sort menu of Next and Waiting for, and the order it puts tasks in. The
   board's columns keep the list's order, urgency chip and all. */
const byTaskName = (x, y) => plainTitle(x.title).localeCompare(plainTitle(y.title), undefined, {numeric: true, sensitivity: "base"});
