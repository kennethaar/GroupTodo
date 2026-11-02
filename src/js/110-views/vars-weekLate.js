const weekLate = id => [...weekRollup(id).values()].flat().filter(it => it.kind === "late").length;
