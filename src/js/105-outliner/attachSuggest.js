function attachSuggest(host, opts = {}) {
  host.addEventListener("input", () => suggestSync(host, opts));
  // Clicking back into a line reopens a [[ or @ list you were in the middle
  // of; a word is only offered while you are typing it.
  host.addEventListener("click", () => suggestSync(host, Object.assign({}, opts, {typed: false})));
  // An arrow key into a squiggled name offers it too, as a click does (#428).
  host.addEventListener("keyup", e => {
    if (/^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key) && !e.shiftKey) suggestSync(host, Object.assign({}, opts, {typed: false}));
  });
  host.addEventListener("blur", () => { if (SUGGEST && SUGGEST.host === host) suggestClose(); });
}
