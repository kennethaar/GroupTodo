const actVerbOf = title => { const m = /^\s*([\p{L}\p{M}\-]+)/u.exec(title || ""); return m ? VERB_LOOKUP[m[1].toLowerCase()] || null : null; };
// The people a line names, and the people of its project: the likeliest to be waited on.
const actPeople = r => [...new Set([
  ...linksIn(r.block.title).map(l => trim(l.split("][")[0])).filter(l => /^p\//i.test(l)).map(l => l.slice(2)),
  ...(r.projectPath ? projectPeople({space: r.space, path: r.projectPath}) : [])])];
