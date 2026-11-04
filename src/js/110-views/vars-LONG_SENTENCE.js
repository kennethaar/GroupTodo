/* ---------- Book › Revise (#254) ----------
   Where the text could be tighter, chapter by chapter: how hard it reads
   (LIX: words a sentence, and the share of words over six letters), the
   sentences over LONG_SENTENCE words, how much is talk, the words that tell
   a feeling instead of showing it (felt, saw, realised), adverbs, and a word
   used twice within REPEAT_NEAR words. The words used most across the book,
   and what the text says of a character against what their page says. Each
   is a pointer to look again, never a rule. */
const LONG_SENTENCE = 30, REPEAT_NEAR = 12;
const FILTER_WORDS = new Set(["felt", "feel", "feels", "saw", "see", "sees", "heard", "hear", "noticed", "notice", "realised", "realized",
  "seemed", "seems", "wondered", "thought", "knew", "watched", "decided", "kjente", "følte", "så", "hørte", "merket", "skjønte", "virket",
  "lurte", "tenkte", "visste", "bestemte", "kände", "såg", "hörde", "märkte", "verkade", "undrade", "tänkte", "visste"]);
const ADVERB_SKIP = new Set(["only", "early", "family", "fly", "holy", "lovely", "ugly", "reply", "supply", "apply", "rely", "july", "italy",
  "belly", "jelly", "bully", "lily", "silly", "daily", "likely", "friendly", "lonely", "elderly", "really"]);
const STOP_WORDS = new Set(("the a an and or but of to in on at for with as by from that this it its is was were be been are he she they " +
  "his her their him them i you we me my your our not no so then there here what which who when where how all one had have has do did " +
  "said says would could will can into out up down over just like if than too very og i på at er var en et det den de han hun som med " +
  "for til av seg sin sitt sine ikke men så har hadde jeg du vi dem meg deg om fra da nå der her hva hvem når hvor kan skal vil ble blir").split(/\s+/));
const wordList = text => String(text).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
const sentencesOf = text => String(text).split(/(?<=[.!?…]["”»’']*)\s+(?!\p{Ll})/u).filter(s => wordList(s).length);
