const trackerNum = v => { const x = parseFloat(String(v == null ? "" : v).replace(",", ".")); return isFinite(x) ? x : null; };
const TRACKER_DONE_RE = /^(x|y|yes|ja|j|done|ok|1|✓|true)$/i;
