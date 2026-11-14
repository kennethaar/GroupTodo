/* Import .vcf file: a file picker, then the review (#383). */
function pickVCardFile() {
  const input = el("input", {type: "file", accept: ".vcf,text/vcard,text/x-vcard", style: "display:none"});
  input.addEventListener("change", async () => {
    const f = input.files && input.files[0];
    input.remove();
    if (f) openVCardImport(await f.text());
  });
  document.body.append(input);
  input.click();
}
