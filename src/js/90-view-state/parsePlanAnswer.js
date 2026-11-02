function parsePlanAnswer(raw) {
  const plan = {name: "", fields: [], actions: []};
  let last = null;
  const action = t => {
    const m = /^(TODO|DOING|NOW|LATER|WAITING|WAIT)\b[:\s]*(.*)$/.exec(t);
    if (!m) return false;
    const state = PLAN_STATE[m[1]];
    last = {state, title: state === "WAIT" ? trim(m[2]).replace(/^for\s+/i, "") : trim(m[2]), props: {}};
    (plan.fields.length && plan.fields[plan.fields.length - 1].key === "decide"
      ? plan.fields[plan.fields.length - 1].actions : plan.actions).push(last);
    return true;
  };
  for (const line of String(raw || "").replace(/\r\n?/g, "\n").split("\n")) {
    if (/^\s*```/.test(line)) continue;
    const t = trim(line.replace(/^\s*(?:[-*+•]\s+)+/, "").replace(/\*\*/g, ""));
    if (!t) continue;
    const prop = /^([A-Za-z][\w-]*)::\s*(.*)$/.exec(t);
    if (prop) {
      const d = dateIn(prop[2]);
      if (last && d && /^(DEADLINE|SCHEDULED)$/i.test(prop[1])) last.props[prop[1].toUpperCase()] = "[[" + d + "]]";
      continue;
    }
    if (action(t)) continue;
    last = null;
    const f = /^\[?(stakeholders|purpose|vision|decide|project name)\]?([^:]*:)\s*(.*)$/i.exec(t);
    if (f) {
      const key = f[1].toLowerCase(), value = trim(f[3]);
      if (key === "project name") { if (value) plan.name = value; continue; }
      plan.fields.push({key, label: trim(t.slice(0, t.length - f[3].length)), value: "", actions: []});
      if (!(key === "decide" && action(value))) plan.fields[plan.fields.length - 1].value = value;
      continue;
    }
    if (!plan.name && !plan.fields.length) plan.name = t.replace(/^#+\s*/, "");
  }
  plan.name = trim(plan.name.replace(/^\[\[(?:\d\/)?(.*?)\]\]$/, "$1").replace(/^\[(.*)\]$/, "$1").replace(/:$/, ""));
  for (const f of plan.fields) plan.actions.push(...f.actions);
  return plan;
}
