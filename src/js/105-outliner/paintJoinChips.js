/* Join stands out while its meeting is near or on (#480). */
function paintJoinChips(chips = document.querySelectorAll("a.chip.join[data-from]")) {
  const now = Date.now();
  for (const a of chips) a.classList.toggle("soon", now >= +a.dataset.from && now < +a.dataset.to);
}
