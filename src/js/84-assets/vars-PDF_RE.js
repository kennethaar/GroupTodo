/* A PDF in assets/ can be read where it is linked (#331). A caret beside the
   paperclip unfolds it under the line; written ![name](x.pdf), as Obsidian
   embeds one, it starts unfolded. Unfolding is a view and not an edit, so it
   is kept on this device per file and the line stays as it was written. */
const PDF_RE = /\.pdf$/i;
const pdfFoldKey = path => "pdf.open." + (V.space || "") + "|" + path;
const pdfOpen = (path, bang) => { const v = PREF.get(pdfFoldKey(path)); return v ? v === "1" : !!bang; };
// Android Chrome and some others draw no PDF inside a page; they say so here.
const canShowPdf = () => navigator.pdfViewerEnabled !== false;
// The PDF links a line holds, in the order written: [{path, name, bang}].
const pdfLinksIn = text => [...String(text || "").matchAll(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g)]
  .filter(m => isAssetPath(m[3]) && PDF_RE.test(m[3]))
  .map(m => ({path: m[3], name: m[2] || m[3].split("/").pop(), bang: !!m[1]}));
