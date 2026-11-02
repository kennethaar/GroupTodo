function chooseItemTransfer(ctx, target, defaultMode = "sync") {
  let scope = ctx.id ? "branch" : "file", mode = defaultMode;
  const scopes = [["branch", "This line and everything under it"], ["file", "The whole file"]]
    .filter(([value]) => value !== "branch" || ctx.id);
  const body = el("div", {class: "field"},
    el("p", {}, ctx.space + " → " + target),
    ...radioChoices("transfer-scope", scopes, scope, v => { scope = v; }),
    el("p", {}, "Links, properties and attachments come along. Linked pages are handled the same way."),
    ...radioChoices("transfer-mode", TRANSFER_MODES, mode, v => { mode = v; }));
  return askTransfer("What to move, and how", body, () => ({scope, mode}));
}
