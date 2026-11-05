function editBarGroupClose() {
  const pop = $("#editBar .ebpop");
  if (pop) pop.remove();
  $$("#editBar .ebgrp[aria-expanded]").forEach(b => b.setAttribute("aria-expanded", "false"));
  document.removeEventListener("click", editBarGroupOutside, {capture: true});
  document.removeEventListener("keydown", editBarGroupEsc, {capture: true});
}
