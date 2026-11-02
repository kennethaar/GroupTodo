function solUnpaint() {
  document.querySelectorAll(".sol [data-grown]").forEach(solShrink);
  for (const b of document.querySelectorAll(".sol .solzoom, .sol .soltype, .sol .solfit, .sol .solmag, .sol .solnear"))
    b.classList.remove("solzoom", "soltype", "solfit", "solmag", "solnear");
  solArrow(null);
}
