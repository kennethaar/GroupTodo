async function shrinkPhoto(file) {
  if (!/^image\/(jpeg|png|webp|heic|heif|avif|bmp)$/i.test(file.type || "")) return file;
  let bmp;
  try { bmp = await createImageBitmap(file); } catch (_) { return file; }
  const scale = Math.min(1, PHOTO_MAX_PX / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 600 * 1024) { bmp.close && bmp.close(); return file; }
  const cv = document.createElement("canvas");
  cv.width = Math.round(bmp.width * scale); cv.height = Math.round(bmp.height * scale);
  const cx = cv.getContext("2d");
  cx.fillStyle = "#fff"; cx.fillRect(0, 0, cv.width, cv.height);   // a transparent PNG is not left black
  cx.drawImage(bmp, 0, 0, cv.width, cv.height);
  bmp.close && bmp.close();
  const blob = await new Promise(r => cv.toBlob(r, "image/jpeg", 0.82));
  if (!blob || blob.size >= file.size) return file;
  const stem = String(file.name || "photo").replace(/\.[A-Za-z0-9]{1,8}$/, "") || "photo";
  return new File([blob], stem + ".jpg", {type: "image/jpeg", lastModified: file.lastModified || Date.now()});
}
