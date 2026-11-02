/* A question is written to yourself, in whatever order it came out: "ask
   Alexander Bee about the pollen", "status on this, Alexander Bee?", "Alexander
   Bee what is the status". It goes to Alexander in two parts: what it is about,
   which is the project it sits in, and the question left when his name and the
   asking are gone. A question that says nothing but "what is the status of
   this" gets the plain one in the mail's language, since "this" is the
   project above it. */
// Word lists as regex sources, so the language catalog does not take them for text.
const ASK_VERB = /ask|check with|spør|spørr|spørre|sjekk med|hør med|fråga|kolla med|spørg|frag/.source;
const ASK_ABOUT = "about|on|re:?|om|angående|ang\\.?|vedr\\.?|vedrørende|wegen";
// "om dette er mulig" is a question turned inside out: "er dette mulig?"
const ASK_INDIRECT = "om|if|whether|ob";
const ASK_FINITE = "er|var|blir|kan|skal|vil|må|har|bør|går|är|ska|vill|måste|" +
  "is|are|was|were|can|could|will|would|should|has|have|does|do|did|ist|sind|kann|wird|hat|geht";
const ASK_QWORD = /^(?:hva|hvem|hvor|hvorfor|hvordan|når|hvilk\p{L}*|hvad|vad|vem|var|varför|hur|när|vilk\p{L}*|what|who|where|why|how|when|which|was|wer|wo|warum|wie|wann|welch\p{L}*)$/iu;
const ASK_GENERIC = new Set(/hva|hvad|vad|what|wie|was|er|är|is|ist|the|der|den|det|dette|denne|detta|this|it|that|das|dem|status|stand|update|oppdatering|uppdatering|opdatering|nytt|news|latest|siste|noe|any|på|on|of|om|for|för|zu|von|til|med|with|about|waiting|wait|venter|väntar|warte|warten|svar|svaret|answer|reply|antwort|feedback|tilbakemelding|fra|från|from|auf/
  .source.split("|"));
const askEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const askNameRe = name => new RegExp("(?<![\\p{L}\\p{N}])(?:(?:" + ASK_VERB + ")\\s+)?" + askEsc(name) +
  "(?![\\p{L}\\p{N}])", "giu");
