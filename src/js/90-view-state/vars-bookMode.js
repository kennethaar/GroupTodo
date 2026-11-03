/* Outline or Prose, and beats shown or not, per device. */
const bookMode = () => PREF.get("book.mode", "outline") === "prose" ? "prose" : "outline";
const beatsHidden = () => PREF.get("book.beats", "show") === "hide";
