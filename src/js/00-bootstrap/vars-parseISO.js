const parseISO = s => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  return m ? new Date(+m[1], +m[2]-1, +m[3], 12) : null;
};
const shiftISO = (iso, days) => { const d = parseISO(iso) || new Date(); d.setDate(d.getDate()+days); return isoOf(d); };
