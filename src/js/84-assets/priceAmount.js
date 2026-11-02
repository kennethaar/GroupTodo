function priceAmount(num) {
  const minus = /^[-−(]/.test(num);
  const m = /^(.*?)(?:[.,](\d{1,2}))?$/.exec(num.replace(/[\s ()−-]/g, ""));
  const n = parseFloat(m[1].replace(/[.,]/g, "") + "." + (m[2] || "0"));
  return minus ? -n : n;
}
