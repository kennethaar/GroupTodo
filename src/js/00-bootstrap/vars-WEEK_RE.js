/* A week by its ISO name, "2026-W44": the name of its page and of a link to it.
   The names sort as the weeks do. */
const WEEK_RE = /^(\d{4})-W(\d{2})$/;
const weekOf = iso => { const w = isoWeek(iso); return w ? w[1] + "-W" + pad2(w[0]) : null; };
