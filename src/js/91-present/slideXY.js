// "3,-2" as [3, -2] (#487); null for none or anything else.
function slideXY(v) {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(v ?? ""));
  return m ? [+m[1], +m[2]] : null;
}
