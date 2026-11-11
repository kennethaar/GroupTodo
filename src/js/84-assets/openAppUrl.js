// Hand a link to the app that owns it. An app link leaves the page as it is.
function openAppUrl(url) {
  if (/^https?:/i.test(url)) window.open(url, "_blank", "noopener");
  else location.href = url;
}
