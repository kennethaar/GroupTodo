const numIn = s => { const x = parseFloat(String(s || "").replace(/\s/g, "").replace("−", "-").replace(",", ".")); return isFinite(x) ? x : null; };
