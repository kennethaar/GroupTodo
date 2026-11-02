const blobBase64 = blob => new Promise((ok, bad) => {
  const r = new FileReader();
  r.onload = () => ok(String(r.result).replace(/^data:[^,]*,/, ""));
  r.onerror = () => bad(r.error);
  r.readAsDataURL(blob);
});
