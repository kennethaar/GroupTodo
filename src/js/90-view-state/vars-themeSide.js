/* ---------- light or dark ----------
   The system decides until this button says otherwise. Which light and which
   dark it flips between is picked under Styles. */
const themeSide = () => document.documentElement.dataset.theme ||
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
