/* Every name you go by, in any area: the name is set per area, so the same
   person can be "Kenneth" in one and "Kenneth Aar" in another. Looking across
   areas, any of them is you -- not somebody else with your name. */
function myNames() {
  const all = [PREF.get("identity", ""), ...Spaces.list.map(s => PREF.get("identity:" + s.name, ""))];
  return [...new Set(all.map(n => trim(n || "")).filter(n => n && n !== NO_NAME))];
}
