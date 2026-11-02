/* Square, downscaled, and squeezed until the text fits. */
function shrinkToDataURI(file, px, limit) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.width, img.height);
      const cv = document.createElement("canvas");
      cv.width = cv.height = px;
      const cx = cv.getContext("2d");
      cx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, px, px);
      let q = 0.82, out = "";
      for (let i = 0; i < 7; i++) {
        out = cv.toDataURL("image/jpeg", q);
        if (out.length <= limit) return resolve(out);
        q -= 0.1;
      }
      resolve(out.length <= limit * 1.5 ? out : null);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("not an image")); };
    img.src = url;
  });
}
