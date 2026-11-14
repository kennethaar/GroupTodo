/* Settles once no line, box or field has the cursor. Moving from one line on
   to the next is still typing: only a focus that lands nowhere editable ends
   it. The lines on screen stay bound to the pages they were drawn from until
   then (renderUnlessTyping), so a record swapped in sooner would not have
   them (#232). */
function untilTypingStops() {
  const typing = () => {
    const a = document.activeElement;
    return !!a && (a.isContentEditable || /^(INPUT|TEXTAREA)$/.test(a.tagName || ""));
  };
  return new Promise(done => {
    if (!typing()) return done();
    const check = () => setTimeout(() => {
      if (typing()) return;
      document.removeEventListener("focusout", check);
      done();
    }, 0);
    document.addEventListener("focusout", check);
  });
}
