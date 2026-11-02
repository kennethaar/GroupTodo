function copyLanguageForAI(name) {
  copyText("Translate this language file for the GroupToDo app from English to " + name + ".\n" +
    "Each line is: English text => translation. Write the translation after => on every line, " +
    "and keep the English before => exactly as it is. Keep every line, in the same order. " +
    "Keep {1}, {2}, [[links]], #tags, key names (Ctrl, Enter, Tab), file names and the lines at the top " +
    "(language::, code::) as they are. Use short, plain words, as an app does. " +
    "Answer with the whole file and nothing else.\n\n" + langTextOf(name),
    "Copied. Paste it into an AI, then bring the answer back with Paste a translation.", "Copy for an AI");
}
