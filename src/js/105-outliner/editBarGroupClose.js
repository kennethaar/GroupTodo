function editBarGroupClose() {
  $$("#editBar .ebpop").forEach(p => p.remove());
  $$("#editBar .ebgrp[aria-expanded]").forEach(b => b.setAttribute("aria-expanded", "false"));
  document.removeEventListener("click", editBarGroupOutside, {capture: true});
  document.removeEventListener("keydown", editBarGroupEsc, {capture: true});
}
