/* Whether a day gets it, by the same reading the templates are poured with. */
const whenOnDay = (names, day) => templateCandidates(day).some(n => names.has(n));
