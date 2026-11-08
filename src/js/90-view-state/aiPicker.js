/* The AI you use in an area, and the button that copies the prompt in box to
   it. Shared by every dialog that hands a prompt to an AI. reopen draws the
   dialog again after an address is typed in. */
function aiPicker(space, box, reopen) {
  const ai = el("select", {"aria-label": "Your AI", style: "width:auto"});
  const own = planAiOf(space);
  const saved = [...planAiSaved(), own].filter((u, i, l) => u && l.indexOf(u) === i && !PLAN_AIS.some(([k]) => k === u));
  const choices = [...PLAN_AIS, ...saved.map(u => [u, planAiName(u)])];
  for (const [u, n] of [...choices, ["\u0001", "Another, by its address…"]]) {
    const o = el("option", {value: u}, n);
    if (u === own) o.selected = true;
    ai.append(o);
  }
  const button = el("button", {class: "btn ghost"});
  const label = () => { button.textContent = ai.value ? "Copy and open " + planAiName(ai.value) : "Copy the prompt"; };
  ai.addEventListener("change", () => {
    if (ai.value === "\u0001") {
      promptInput({title: "Your AI", label: "The address of its chat page", value: "https://", cta: "Use it",
        hint: "Opened in a new tab each time you copy a prompt in this area.",
        onSave: url => {
          if (/^https?:\/\/\S+\.\S+/.test(url)) { PREF.set("plan.ai:" + (space || ""), url); planAiRemember(url); }
          else notify("That is not a web address: it starts with https://", "warn");
          reopen();
        }});
      return;
    }
    PREF.set("plan.ai:" + (space || ""), ai.value);
    label();
  });
  label();
  button.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(box.value); }
    catch (_) { box.focus(); box.select(); notify("The browser would not copy it: press Ctrl+C, the prompt is selected.", "warn"); return; }
    notify("Copied " + box.value.length.toLocaleString() + " characters. Paste it into " +
      (ai.value ? planAiName(ai.value) : "your AI") + ", then its answer here.");
    if (ai.value) window.open(ai.value, "_blank", "noopener");
  });
  return {select: ai, button};
}
