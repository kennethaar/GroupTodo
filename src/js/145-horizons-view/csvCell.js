function csvCell(v, sep) {
  let s = String(v ?? "");
  // A cell that starts with = + - or @ is a formula to Excel. A task is not one.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /["\r\n]/.test(s) || s.includes(sep) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
