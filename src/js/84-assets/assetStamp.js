function assetStamp() {
  const d = new Date(), pad = n => String(n).padStart(2, "0");
  return "" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
         "-" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
}
