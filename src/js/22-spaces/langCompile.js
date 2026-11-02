function langCompile(pairs) {
  LANG.dict = new Map(); LANG.tpl = new Map();
  for (let [k, v] of pairs) {
    k = k.replace(/\s+/g, " ");
    if (!/\{\d+\}/.test(k)) { if (v && v !== k) LANG.dict.set(k, v); continue; }
    const bits = k.split(/\{(\d+)\}/), ids = [];
    let src = "^";
    bits.forEach((b, i) => {
      if (i % 2) { ids.push(b); src += "(.+?)"; }
      else src += b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    });
    const lead = bits[0].length >= 3 ? bits[0].slice(0, 3) : "";
    if (!LANG.tpl.has(lead)) LANG.tpl.set(lead, []);
    LANG.tpl.get(lead).push({re: new RegExp(src + "$"), ids, to: v});
  }
}
