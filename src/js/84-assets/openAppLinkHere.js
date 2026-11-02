function openAppLinkHere(target) {
  if (/^https?:/.test(target)) window.open(target, "_blank", "noopener");
  else window.location.href = target;
}
