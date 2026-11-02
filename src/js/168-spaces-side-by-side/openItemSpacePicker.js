function openItemSpacePicker(ctx) {
  if (!ctx?.path || !ctx.space) return;
  const body = el("div", {}, el("p", {}, "Current area: " + ctx.space));
  for (const sp of Spaces.list) {
    if (sp.name === ctx.space) continue;
    body.append(el("button", {class: "pick", onclick: async () => {
      closeModal();
      const choice = await chooseItemTransfer(ctx, sp.name);
      if (!choice) return;
      try {
        if (await runItemTransfer(ctx, sp.name, choice) && choice.scope === "file") {
          await openSpace(sp.name);
          openPage(ctx.path);
        }
      } catch (e) { notify("The transfer did not finish: " + e.message, "error"); }
    }}, sp.name));
  }
  modal({title: "Move to another area", body, foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel")]});
}
