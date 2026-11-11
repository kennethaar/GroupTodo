/* ---------- first run and migration ---------- */
/* Is this page being served by serve.py? SERVER_BASE is its folder at the
   root, given with --vault; "" when it has none. SERVER_INFO is what its ping
   said: the server folders chosen in the app, each at its own address
   (f/<name>), and what else it does (#357). */
let SERVER_BASE = null;
let SERVER_INFO = null;
