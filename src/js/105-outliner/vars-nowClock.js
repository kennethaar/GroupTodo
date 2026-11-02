const nowClock = () => { const d = new Date(); return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); };
const timeLogWho  = b => trim((/\[\[p\/([^\]]+)/i.exec(b.title || "") || [])[1] || "");
const timeLogProj = b => trim((/\[\[[-0123]\/([^\]]+)/.exec(b.title || "") || [])[1] || "");
/* What is left of the line once the tag, the person and the project are out. */
const timeLogNote = b => trim(String(b.title || "").replace(TIMELOG_RE, " ")
  .replace(/\[\[(?:p|[-0123])\/[^\]]*(?:\]\[[^\]]*)?\]\]/gi, " ").replace(/\s{2,}/g, " "));
const timeLogOpen = b => clockMin(blockProp(b, "in")) != null && clockMin(blockProp(b, "out")) == null
  && !trim(blockProp(b, "hours") || "");
