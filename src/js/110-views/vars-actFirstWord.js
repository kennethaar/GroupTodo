// The first word, when it could be a verb the lexicon has not heard yet.
const actFirstWord = r => { const m = /^\s*([\p{L}\p{M}\-]{3,})/u.exec(plainTitle(r.block.title)); return m ? m[1].toLowerCase() : null; };
