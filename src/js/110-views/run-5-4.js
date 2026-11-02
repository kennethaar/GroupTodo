PHONE.addEventListener("change", paintCapHint);
paintCapHint();
PHONE.addEventListener("change", () => { if (V.loaded && (state.view === "today" || state.view === "next")) render(); });
NARROW.addEventListener("change", () => { if (V.loaded) drawSidePage(); });
