/* The task as the person asked reads it: their own name taken off, at either
   end. "[[p/Ola]]: Trenger dere et møte?" is the way to write a waiting task
   (#347), and "Send the quote - Ola" the older one; both go out as just the
   words to them. A name inside the sentence stays, as does one that only
   starts a longer word (Ola in Olaf). */
function checkinTaskTitle(title, recipient) {
  let text = askUntagged(title);
  const edge = "(?![\\p{L}\\p{N}])";
  for (const name of [recipient, recipient.split(" ")[0]]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)) {
    const safe = askEsc(name);
    text = text.replace(new RegExp("^\\s*" + safe + edge + "\\s*[:,\\-–—]\\s*", "iu"), "")
      .replace(new RegExp("(?:\\s*[-–—,:]\\s*|\\s+)(?<![\\p{L}\\p{N}])" + safe + edge + "\\s*$", "iu"), "");
  }
  return trim(text.replace(/[,:\-–—]+\s*$/, ""));
}
