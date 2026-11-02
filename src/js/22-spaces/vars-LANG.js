const LANG = {
  name: null, code: "", on: false, obs: null, busy: false,
  dict: new Map(),          // English -> translation
  tpl: new Map(),           // first 3 letters -> [{re, ids, to}]
  shown: new WeakMap(),     // text node -> [english, shown]
  attrs: new WeakMap(),     // element -> {attr: [english, shown]}
  missed: new Set(),        // seen on screen, in no line of the file
  when: new Map(),          // a word for a date or time -> its English, from the when: lines
};
