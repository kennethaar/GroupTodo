function addIntention(text) {
  if (!trim(text)) return;
  if (!V.pages.has(INTENTIONS_PATH))
    putPage(INTENTIONS_PATH, {props: {title: "Intentions", type: "horizon", created: todayStamp()}, blocks: []});
  getPage(INTENTIONS_PATH).blocks.push(newBlock({title: trim(text)}, false));
  touch(INTENTIONS_PATH);
}
