/* A picture for the line: the camera straight away, or one already taken.
   It goes where a dropped file goes -- assets/, with the link in the line. */
function editBarPickImage(path, b, camera) {
  if (!canKeepFiles()) { notify("This area has nowhere to keep files yet.", "warn"); return; }
  const input = el("input", {type: "file", accept: "image/*", style: "display:none",
    capture: camera ? "environment" : null, multiple: camera ? null : ""});
  const done = () => input.remove();
  input.addEventListener("cancel", done);
  input.addEventListener("change", async () => {
    const picked = Array.from(input.files || []);
    done();
    if (!picked.length) return;
    const files = await Promise.all(picked.map(shrinkPhoto));
    const txt = $(`.blk[data-id="${b.id}"] .txt`);
    attachFilesToBlock(path, b, files, txt);
  });
  document.body.append(input);
  input.click();
}
