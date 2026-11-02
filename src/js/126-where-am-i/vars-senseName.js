// A context as typed, @ or not; "" for nothing typed.
const senseName = v => { const t = trim(v).replace(/^@/, ""); return t ? slugify(t) : ""; };
