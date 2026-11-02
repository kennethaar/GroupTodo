function usageLine(day, device, places) {
  const parts = Object.entries(places).filter(([, r]) => r[0] || r[1] || r[2])
    .sort((a, b) => b[1][1] - a[1][1] || b[1][0] - a[1][0])
    .map(([p, r]) => p + " " + r[0] + "/" + usageMin(r[1]) + "/" + r[2]);
  return parts.length ? day + " · " + device + " · " + parts.join(", ") : "";
}
