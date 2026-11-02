const trackerTitle = name => {
  const s = String(name || "").replace(/[-_]+/g, " ").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : "Tracker";
};
