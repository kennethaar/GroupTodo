/* ---------- projects that look alike ----------
   The same project started twice -- "Ny nettside Nordlys" and "Nordlys ny
   nettside", or one with a typo -- splits its tasks and its history in two.
   Every project in every status in the areas on screen is compared by name:
   the same words in another order, nearly the same words (a typo still counts
   as the word), or nearly the same name. Look-alikes are grouped, so three
   copies show as one group, and a group you say is not the same stays quiet. */
const TWIN_SKIP = new Set(["og", "i", "på", "til", "for", "med", "av", "en", "et", "ei",
  "the", "and", "of", "to", "a", "an", "in", "on"]);
const twinNorm = t => String(t || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const twinWords = t => twinNorm(t).split(" ").filter(w => w && !TWIN_SKIP.has(w));
