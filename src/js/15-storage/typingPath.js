/* The page a line is being typed into, in this area: the read must not swap it. */
function typingPath(name) {
  const a = document.activeElement;
  if (!a || !(a.isContentEditable || /^(INPUT|TEXTAREA)$/.test(a.tagName || ""))) return null;
  const host = a.closest && a.closest("[data-path]");
  if (!host) return null;
  return (host.dataset.space || V.space) === name ? host.dataset.path : null;
}
