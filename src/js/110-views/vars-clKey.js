/* A line answered with "leave it", or turned into a link to a page, is still
   a plain line on its day, so the deck remembers it by its day and its words,
   on this device, for the week (like the projects' answers). */
const clKey = (path, b) => path + "|" + plainTitle(b.title || "");
