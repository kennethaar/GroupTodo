// href arrives already escaped for HTML, so it is put back first and
// escaped once more on the way out.
const unesc = s => String(s).replace(/&(amp|quot|#39|lt|gt);/g, (all, c) =>
  ({amp: "&", quot: '"', "#39": "'", lt: "<", gt: ">"}[c]));
