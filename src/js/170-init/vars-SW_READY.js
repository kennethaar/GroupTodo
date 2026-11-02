/* Register the service worker whenever this page came from a host -- a static
   site, a company intranet, or serve.py on the phone itself. After the first
   visit the app opens with no network at all: no server running, plane mode,
   or Android having reclaimed Termux. Nothing happens from a file:// page,
   where service workers are not allowed, and the vault is never cached. */
let SW_READY = false;
