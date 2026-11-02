/* Values hidden from a page's list: template_hidden:: on its template, so it
   holds for every page made from it, or on the page itself when it has none. */
const HIDDEN_PROP = "template_hidden";
const hiddenList = v => String(v || "").split(",").map(x => trim(x).toLowerCase()).filter(Boolean);
