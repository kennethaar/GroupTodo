function attachSuggest(host, opts = {}) {
  host.addEventListener("input", () => suggestSync(host, opts));
  // Clicking back into a line reopens a [[ or @ list you were in the middle
  // of; a word is only offered while you are typing it.
  host.addEventListener("click", () => suggestSync(host, Object.assign({}, opts, {typed: false})));
  host.addEventListener("blur", () => { if (SUGGEST && SUGGEST.host === host) suggestClose(); });
}
