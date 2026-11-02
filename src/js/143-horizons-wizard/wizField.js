function wizField(key, placeholder, rows = 6) {
  const ta = el("textarea", {placeholder, style: "min-height:" + (rows * 22) + "px"});
  ta.value = WIZ[key];
  ta.addEventListener("input", () => { WIZ[key] = ta.value; });
  return ta;
}
