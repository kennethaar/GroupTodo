/* Where the device is, if the browser says. Asked for, the browser asks you
   first; a check nobody asked for only looks once you have said yes. */
async function sensePosition(ask) {
  const geo = navigator.geolocation;
  if (!geo) return null;
  if (!ask) {
    try {
      if ((await navigator.permissions.query({name: "geolocation"})).state !== "granted") return null;
    } catch (_) { return null; }
  }
  return new Promise(res => geo.getCurrentPosition(
    p => res({lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy}),
    () => res(null), {timeout: 10000, maximumAge: 120000}));
}
