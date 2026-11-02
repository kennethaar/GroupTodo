const sendMarkdownOut = (name, text, opts = {}) =>
  sendFileOut(name, text, "text/markdown", opts);
