function darlingsPage() {
  if (!getPage(DARLINGS_PATH)) putPage(DARLINGS_PATH, {props: {title: "darlings", created: todayStamp()}, blocks: []});
  return getPage(DARLINGS_PATH);
}
