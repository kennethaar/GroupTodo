/* Where a line lives, in the words the app uses: "Journal · Today", or the
   page's title. Never the file path -- that is storage, not a place (P12). */
function placeName(path) {
  const day = /^journals\/(?:.*\/)?(\d{4}-\d{2}-\d{2})\.md$/i.exec(path || "");
  return day ? "Journal \u00b7 " + humanDate(day[1]) : pageTitle(path);
}
