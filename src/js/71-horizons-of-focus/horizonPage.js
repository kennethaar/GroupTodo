function horizonPage(key, create) {
  const path = horizonPath(key);
  if (!V.pages.has(path) && create) {
    const h = HORIZON_BY_KEY[key];
    putPage(path, {
      props: {title: h?.page || key, type: "horizon", horizon: h?.level || "",
              created: todayStamp()},
      blocks: [],
    });
  }
  return V.pages.has(path) ? getPage(path) : null;
}
