/* A phone-wide screen has no room for ⇧ in the bar: it is the area menu's first row. */
function sendInAreaMenu() { return phoneLike() && PHONE.matches; }
