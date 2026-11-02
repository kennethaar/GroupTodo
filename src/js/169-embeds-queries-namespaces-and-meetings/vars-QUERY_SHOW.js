const QUERY_SHOW = 25;
const QUERY_ALL_MAX = 500;      // past this, a list is a search, and the Search screen is better at it
const QUERY_OPEN = new Set();          // queries opened past QUERY_SHOW, by line id
