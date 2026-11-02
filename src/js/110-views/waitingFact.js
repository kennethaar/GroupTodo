function waitingFact(path) {
  const r = {space: V.space, path};
  const raw = getPage(path)?.props?.waiting_for || "";
  const who = waitingPersonName(raw);
  return {
    key: "waiting for", raw: "waiting_for:: " + raw,
    save: v => saveRawProp(path, "waiting_for", v),
    pills: () => [factPill(who || "+ who?", who ? "fquiet" : "fwant", "who this project is waiting on",
      () => solAskWaiting(r))],
  };
}
