/* The address of the serve.py this page came from: its folder, no file name. */
function servedAt() {
  return location.origin + location.pathname.replace(/\/[^/]*$/, "");
}
