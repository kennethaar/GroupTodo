/* The name the file gets in the folder: what it was called, tidied into
   something every filesystem accepts, and stamped so a second screenshot
   called "image.png" does not land on top of the first. */
function assetFileName(file) {
  const raw = String((file && file.name) || "");
  const dot = raw.lastIndexOf(".");
  const dotted = dot > 0 && /^\.[A-Za-z0-9]{1,8}$/.test(raw.slice(dot));
  const ext = dotted ? raw.slice(dot).toLowerCase()
    : "." + (String((file && file.type) || "").split("/")[1] || "bin").replace(/[^a-z0-9]/g, "").slice(0, 8);
  const stem = (dotted ? raw.slice(0, dot) : raw) || "pasted";
  const slug = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "file";
  return slug + "-" + assetStamp() + ext;
}
