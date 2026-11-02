const hostText = host => host.isContentEditable ? host.textContent : host.value;
/* A line's words as they go back into the file: one line, plain spaces. The
   space after a link taken from the list is a no-break space while you type,
   or the browser would swallow it at the end of the line. */
const lineText = node => node.textContent.replace(/\n/g, " ").replace(/\u00A0/g, " ");
