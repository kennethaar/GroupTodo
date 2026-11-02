/* What a dropped file becomes in the line: a picture shows itself, anything
   else is a link you can click. Plain markdown either way, so the note still
   reads in Notepad and in every other editor that opens the folder. */
const assetMarkdown = (file, path) =>
  ((ASSET_IMAGE_RE.test(path) || /^image\//.test((file && file.type) || "")) ? "!" : "") +
  "[" + String((file && file.name) || "file").replace(/[\[\]()]/g, "") + "](" + path + ")";
