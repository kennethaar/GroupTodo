/* What stands in the page's place while a link waits for its page (#474). */
function linkOpeningNode() {
  return el("div", {class: "wrap linkopening", role: "status", "aria-live": "polite", style: "padding:24px"},
    linkOpeningLabel(LINK_OPENING));
}
