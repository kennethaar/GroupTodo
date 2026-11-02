/* ---------- how a sheet adds up ---------- */
function mySetting(key) {
  const me = whoAmI();
  return trim(String((me && getPage(personPath(me))?.props?.[key]) || PREF.get(key, "") || ""));
}
