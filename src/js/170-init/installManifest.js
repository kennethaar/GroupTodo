/* ============================================================
   INSTALLABLE WITHOUT INSTALLING
   Opened from a URL, this is an app: the manifest gives it a home-screen
   icon and its own window, the service worker lets it open with no network,
   and the share sheet carries the vault file to whichever cloud app the
   phone already has. Nothing is installed from a store and no account exists.

   Opened as a downloaded file:// page it is still the same app, minus the
   three things a file:// page is not allowed: a real manifest, a service
   worker, and the share sheet. Those degrade to a blob manifest and plain
   downloads.
   ============================================================ */

/* A manifest from the server when there is one -- only a real URL may declare
   share_target and file_handlers -- and a blob otherwise, so a file:// page
   stays a single document with nothing to fetch. */
function installManifest() {
  if (CAP.served) {
    document.head.append(el("link", {rel: "manifest", href: "./manifest.webmanifest"}));
    document.head.append(el("link", {rel: "icon", href: "./icon.svg", type: "image/svg+xml"}));
    return;
  }
  try {
    const icon = SVG_URI("app-icon");
    const manifest = {
      name: "GroupToDo", short_name: "GroupToDo", start_url: ".", scope: ".",
      display: "standalone", background_color: "#0f1115", theme_color: "#0f1115",
      icons: [{src: icon, sizes: "192x192", type: "image/svg+xml", purpose: "any maskable"}],
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(manifest)], {type: "application/manifest+json"}));
    document.head.append(el("link", {rel: "manifest", href: url}));
    document.head.append(el("link", {rel: "icon", href: icon, type: "image/svg+xml"}));
  } catch (_) { /* a browser without Blob URLs still runs fine, just not installable */ }
}
