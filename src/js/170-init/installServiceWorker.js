function installServiceWorker() {
  if (!CAP.served || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./sw.js")
    .then(() => navigator.serviceWorker.ready)
    .then(() => { SW_READY = true; })
    .catch(() => { /* a host without sw.js: everything else still works */ });
}
