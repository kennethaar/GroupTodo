/* The files of one read, laid into the record: pages, and the files beside
   them that are not pages. A page already held whose file has not changed
   since stays the same page (#232). */
function fillRecord(record, files, held = null) {
  record.pages.clear(); record.raw.clear();
  record.base = new Map();
  record.copies = new Map();
  record.langs = new Map();
  record.prompts = new Map();
  record.drafts = new Map();
  record.css = new Map();
  let couriers = 0;
  for (const [path, text] of files) {
    if (isNpmDraftPath(path)) { record.drafts.set(path, text); continue; }   // a plan not yet written, not a page
    if (isGuidePath(path)) continue;          // a folder's guide, not a page
    if (isVaultCssPath(path)) { record.css.set(path, text); continue; }   // your own look, not a page
    if (isLangPath(path)) { record.langs.set(path, text); continue; }   // the app's words, not a page
    if (isPromptPath(path)) { record.prompts.set(path, text); continue; }   // a prompt for an AI, not a page
    if (/\.org$/i.test(path)) { record.raw.set(path, text); continue; }
    if (syncCopyOf(path)) { record.copies.set(path, text); continue; }   // Syncthing's, folded in later
    if (looksLikeBundle(text)) { couriers++; continue; }
    const had = held && held.get(path);
    if (had && PAGE_SRC.get(had) === text) record.pages.set(path, had);
    else { const page = parsePage(text); PAGE_SRC.set(page, text); record.pages.set(path, page); }
    noteBase(record, path, text);
  }
  return couriers;
}
