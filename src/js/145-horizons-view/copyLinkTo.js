async function copyLinkTo(url, what) {
  return copyOneLine(url, {
    title: "Link to " + what,
    ok: "Link to " + what + " copied." +
      (CAP.served ? "" : " It only opens for somebody whose copy of the app sits at the same path."),
    hint: CAP.served ? "Paste it anywhere - chat, email, a document."
      : "This app is open as a file, so the link only works for somebody whose copy " +
        "sits at the same path. Serve it from a web address and the link works for everybody.",
  });
}
