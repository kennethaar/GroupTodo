/* ---------- to Excel ----------
   A CSV is the one table every spreadsheet opens without asking, so that is
   what leaves. Excel splits on the machine's list separator, which is a
   semicolon wherever the decimal mark is a comma (Norway, Sweden, most of
   Europe), so the file uses whichever this machine would expect, and it starts
   with a byte-order mark so that æøå arrive as æøå and not as mojibake. */
function csvSeparator() {
  try { return (1.5).toLocaleString().includes(",") ? ";" : ","; } catch (_) { return ","; }
}
