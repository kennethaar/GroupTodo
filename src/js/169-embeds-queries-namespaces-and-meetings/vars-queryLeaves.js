const queryLeaves = q => q.args ? q.args.flatMap(queryLeaves) : [q];
const isPageQuery = q => { const l = queryLeaves(q).filter(x => x.op !== "true"); return l.length > 0 && l.every(x => x.op === "pageprop"); };
