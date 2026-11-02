function qbText(st) {
  const parts = st.rows.map(qbRowText).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0];
  return "(" + st.mode + " " + parts.join(" ") + ")";
}
