/* The one door into the search screen, so every way in -- the button, the "/"
   key, the tour -- arrives with the filter already set and an empty box. */
function goSearch() {
  go("search", {searchFilter: searchFilterForNow(), query: "", searchDraft: ""});
}
