PHONE.addEventListener("change", paintCapHint);
paintCapHint();
PHONE.addEventListener("change", () => { if (V.loaded && (state.view === "today" || state.view === "next")) render(); });
NARROW.addEventListener("change", () => { if (V.loaded) drawSidePage(); });
// #399 the Timer floats on a computer and sits in the drawer on a phone: move it as the width crosses.
PHONE.addEventListener("change", () => { if (V.loaded) renderNav(); });
