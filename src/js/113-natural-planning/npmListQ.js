/* A question answered a line at a time: Enter adds the line, Enter on an empty box moves on.
   Rules we play by also gets prompts, and the AI's rules to pick from (#277). */
function npmListQ(k) {
  const lines = NPM[k], rules = k === "principles";
  const input = el("input", {class: "npmin", placeholder: lines.length ? "Another line, or Enter to go on" : "Type a line and press Enter",
    "aria-label": "A line"});
  const add = () => { const v = trim(input.value); if (!v) return false; lines.push(v); input.value = ""; npmSave(); render(); return true; };
  NPM_PENDING = () => { const v = trim(input.value); if (v) { lines.push(v); npmSave(); } };
  input.addEventListener("keydown", e => {
    if (rules && e.key === " " && !input.value && !NPM.hideDeck) { e.preventDefault(); npmDraw("ruleDeck", NPM_RULES.length); return; }
    if (e.key !== "Enter" || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    if (!add()) npmNext();
  });
  const parts = [el("ul", {class: "npmlines"}, ...lines.map((l, n) => el("li", {},
      el("button", {class: "npmline", title: "Click to change it",
        onclick: () => { lines.splice(n, 1); npmSave(); render(); requestAnimationFrame(() => { const b = $(".npmin"); if (b) { b.value = l; b.focus(); } }); }}, "• " + l)))),
    input,
    el("div", {class: "npmsay"}, "Enter adds the line. Enter on an empty box goes on.")];
  if (!rules) return parts;
  const offered = NPM.ruleSuggest || [];
  if (offered.length) parts.push(el("div", {class: "npmsuggest"},
    el("div", {class: "npmh"}, "The AI suggests · click one to keep it"),
    ...offered.map((l, n) => el("button", {class: "btn sm ghost", onclick: () => {
      offered.splice(n, 1); NPM.ruleSuggest = offered; lines.push(l); npmSave(); render(); }}, "✧ " + l))));
  // The AI needs a Why or a Must achieve to go on.
  const deck = npmDeck(NPM_RULES, "ruleDeck",
    NPM.purpose.length || NPM.onpurpose.length ? el("button", {class: "btn sm ghost", title: "Copies a prompt for your AI. You pick which rules to keep",
      onclick: () => npmAiAsk("rules")}, "✧ Ask AI for 3 rules") : null,
    NPM.ai === "rules" ? npmAiPaste("rules") : null);
  return [el("div", {class: "npmcap"}, el("div", {}, ...parts), deck)];
}
