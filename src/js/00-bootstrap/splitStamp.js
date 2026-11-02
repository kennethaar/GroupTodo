/* A stamp like "Kenneth 2026-10-05T18:43:38Z" splits into who and when. */
function splitStamp(value) {
  const m = /^(.*?)\s*(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\s*$/.exec(trim(value || ""));
  return m ? {who: trim(m[1]), iso: m[2]} : {who: trim(value || ""), iso: null};
}
