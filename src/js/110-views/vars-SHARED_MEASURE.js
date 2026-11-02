/* What a shared chart shows of each letter that can share one. */
const SHARED_MEASURE = {i: "number", n: "number", m: "minutes", t: "hours", a: "amount"};
const trackerChartOf = g => g && SHARED_MEASURE[g.code || ""] ? trackerProp(g.name, "chart") : "";
const sameChart = (a, b) => !!a && !!b && a.code === b.code && trackerChartOf(a).toLowerCase() === trackerChartOf(b).toLowerCase();
