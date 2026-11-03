/* A property holds one line, so what is typed over several becomes one. */
const oneLine = s => trim(String(s || "").replace(/\s+/g, " "));
