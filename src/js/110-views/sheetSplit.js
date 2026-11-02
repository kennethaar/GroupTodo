/* "Home 62,5, Work 37,5" -- a comma before a digit is a decimal comma. */
function sheetSplit(S) {
  return S.split ? parseSplit(sheetSetting(S, "split")) : [];
}
