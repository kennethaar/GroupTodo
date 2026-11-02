function clPaint() {
  document.querySelectorAll(".clans").forEach((n, i) => n.classList.toggle("on", i === CL.aim));
  const how = document.querySelector(".clhow");
  if (how) how.textContent = CL_ANSWERS[CL.aim].label + ": " + CL_ANSWERS[CL.aim].how;
}
