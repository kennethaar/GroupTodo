function updateToast(u) {
  $("#toasts .toast.update")?.remove();
  nudgeToast({stay: true, kind: "update",
    title: [svgIcon(ICON_SPARKLE), " GroupToDo v" + u.version + " is ready"],
    hint: thingsCount(u.entries) + " since your v" + APP_VERSION + ":",
    body: newsList(u.entries),
    foot: [el("button", {class: "btn primary sm", onclick: () => getUpdate(u.version)},
             UPDATE_HOSTED ? "Update now" : "Download now"),
           el("button", {class: "btn ghost sm", onclick: () => whatsNewDialog(u.entries, {update: u})}, "See what's new")]});
}
