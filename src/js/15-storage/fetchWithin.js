/* fetch() with a time limit. A server that has gone quiet -- Termux asleep on
   the phone, a laptop lid shut -- does not refuse, it just never answers, and
   a start that waited on it waited as long as the browser would (#229). */
async function fetchWithin(url, opts = {}, ms = 10000) {
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), ms);
  try { return await fetch(url, {...opts, signal: stop.signal}); }
  catch (e) {
    if (stop.signal.aborted) throw new Error("no answer from " + String(url).replace(/\?.*$/, "") + " in " + Math.round(ms / 1000) + " s");
    throw e;
  }
  finally { clearTimeout(timer); }
}
