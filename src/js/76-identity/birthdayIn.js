function birthdayIn(props) {
  const k = Object.keys(props || {}).find(k => k.toLowerCase() === BIRTHDAY_PROP);
  return k ? String(props[k] || "") : "";
}
