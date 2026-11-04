const countWords = text => (String(text).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
const chapterWords = path => chapterText(path).reduce((n, t) => n + countWords(t), 0);
