const dayWithName = iso => iso + " " + parseISO(iso).toLocaleDateString(undefined, {weekday: "long"});
const diffCls = v => v == null ? "" : v < 0 ? "neg" : v > 0 ? "pos" : "";
