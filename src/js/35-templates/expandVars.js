function expandVars(text, vars = {}) {
  return String(text).replace(/%([\w+-]+)%/g, (all, key) => {
    if (key === "empty") return "";
    if (key === "now") return new Date().toISOString();
    if (key === "user") return stampName() || "";
    const date = /^today(?:([+-]\d+)d)?$/.exec(key);
    if (date) {
      const d = new Date(); d.setDate(d.getDate() + Number(date[1] || 0));
      return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
    }
    return key in vars ? vars[key] : all;
  });
}
