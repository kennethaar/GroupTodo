/* Whoever already works somewhere is hidden while people are being placed,
   on both boards, until the chip shows them again. */
const placedHidden = () => String(PREF.get("board.hidePlaced", "1")) === "1";
const placedChip = n => fchip("Hide people with an organisation" + (n ? " (" + n + ")" : ""), placedHidden(),
  () => { PREF.set("board.hidePlaced", placedHidden() ? "0" : "1"); render(); });
