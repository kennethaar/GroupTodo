const plannerText = (title, max) => {
  const t = plannerWords(title);
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
};
const plannerJson = text => { try { return text ? JSON.parse(text) : null; } catch (_) { return null; } };
