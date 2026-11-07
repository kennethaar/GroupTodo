/* The AI's answer, pasted back. Ideas join the pile, marked ✧. Rules are offered to pick from
   (npmListQ): a rule is chosen, not collected. */
function npmAiPaste(kind) {
  const box = el("textarea", {class: "npmin", rows: "3", placeholder: "Paste the AI's answer", "aria-label": "The AI's answer"});
  const add = () => {
    const lines = String(box.value).split(/\r?\n/).map(l => trim(l.replace(/^\s*(?:[-*•✧]|\d+[.)])\s*/, ""))).filter(Boolean).slice(0, 5);
    if (kind === "rules") {
      const have = new Set([...NPM.principles, ...(NPM.ruleSuggest || [])].map(l => l.toLowerCase()));
      NPM.ruleSuggest = [...(NPM.ruleSuggest || []), ...lines.filter(l => !have.has(l.toLowerCase()))];
    } else for (const l of lines) NPM.ideas.push({id: uid(), t: "✧ " + l, to: null});
    NPM.ai = false; npmSave(); render();
  };
  return el("div", {class: "npmai"}, box, el("button", {class: "btn sm", onclick: add}, "Add them"));
}
