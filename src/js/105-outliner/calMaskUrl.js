/* The link is a secret: only that it is there, never what it says. */
function calMaskUrl(url) {
  return (/^webcal:/i.test(trim(url)) ? "webcal://" : "https://") + "•".repeat(24);
}
