/* The room goes once the writing does. */
document.addEventListener("focusout", () => setTimeout(() => {
  const a = document.activeElement, c = $("#content");
  if (c && !(a && a.isContentEditable && c.contains(a))) c.classList.remove("roomunder");
}, 300));
