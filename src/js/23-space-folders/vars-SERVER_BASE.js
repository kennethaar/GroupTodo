/* ---------- first run and migration ---------- */
/* Is this page being served by serve.py? If so, that is where files belong, and
   a space sitting in browser storage instead would mean nothing the person
   creates ever appears in their folder. */
let SERVER_BASE = null;
