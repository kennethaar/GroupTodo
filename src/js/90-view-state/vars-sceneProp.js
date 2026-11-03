const sceneProp = (s, k) => oneLine(s.block ? blockProp(s.block, k) : "");
const sceneWords = s => proseOf(s.lines).reduce((n, t) => n + countWords(t), 0);
