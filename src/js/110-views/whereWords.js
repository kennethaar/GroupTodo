/* A long list of templates, said briefly. */
function whereWords(names) {
  if (names.length <= 4) return names.join(", ");
  return names.length + " templates, " + names[0] + " to " + names[names.length - 1];
}
