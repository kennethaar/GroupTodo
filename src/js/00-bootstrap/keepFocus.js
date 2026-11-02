function keepFocus(selector, node) {
  REFOCUS = {selector, nth: node ? Math.max(0, $$(selector).indexOf(node)) : 0};
}
