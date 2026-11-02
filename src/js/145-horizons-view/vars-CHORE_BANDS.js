/* Three bands of freshness: red under 25%, yellow to 49%, green from 50%. */
const CHORE_BANDS = [{id: "red", tone: "late", label: "Red", range: "under 25%"},
  {id: "yellow", tone: "today", label: "Yellow", range: "25–49%"},
  {id: "green", tone: "ok", label: "Green", range: "50% and up"}];
const freshBand = pct => pct < 25 ? 0 : pct < 50 ? 1 : 2;
const freshColor = pct => "var(--" + CHORE_BANDS[freshBand(pct)].tone + ")";
