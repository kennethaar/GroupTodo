function blankFactPill(path, f) {
  if (f.key === "outcome") return factPill("+ write outcome", "fout", "Write an outcome",
    () => statusDirOf(path) ? openProjectField({space: V.space, path}, "outcome") : openOutcomeInput(path));
  if (f.key === "children") return f.pills()[0];
  if (OWN_VALUE_KEY_RE.test(f.key.toLowerCase()))
    return factPill("+ write " + f.key, "fwant", "Write " + f.key, () => blankFactPicker(path, f));
  return factPill("+ choose " + f.key, "fwant", "Choose a value", () => blankFactPicker(path, f));
}
