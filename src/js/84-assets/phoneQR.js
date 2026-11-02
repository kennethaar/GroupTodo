function phoneQR(target, phone) {
  const svg = qrSVG(phone);
  if (!svg) { notify("Too long for a QR code, so it opens here.", "warn"); return openAppLinkHere(target); }
  const kind = /^tel:/i.test(phone) ? "call" : /^sms:/i.test(phone) ? "text" : "map";
  let what = phone.replace(/^[a-z]+:/i, "");
  if (kind === "map") {
    const q = /[?&]q=([^&]*)/.exec(what);
    try { what = q ? decodeURIComponent(q[1]) : what; } catch (_) {}
  }
  modal({
    center: true,
    title: {call: "Call from your phone", text: "Text from your phone", map: "Open it on your phone"}[kind],
    body: el("div", {class: "qrbox"},
      el("div", {class: "qrwhat"}, what),
      el("div", {class: "qrpic", html: svg}),
      el("p", {class: "hint"}, {
        call: "Point the phone's camera at the code and it offers to call the number.",
        text: "Point the phone's camera at the code and it offers to send the number a text.",
        map: "Point the phone's camera at the code and the place opens in its maps app.",
      }[kind])),
    foot: [el("button", {class: "btn ghost", onclick: () => { closeModal(); openAppLinkHere(target); }},
             {call: "Call from this PC", text: "Text from this PC", map: "Open the map here"}[kind]),
           el("button", {class: "btn primary", onclick: () => closeModal()}, "Done")],
  });
}
