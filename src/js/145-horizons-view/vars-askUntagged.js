// Your #tags are filing for you, not words for them.
const askUntagged = title => trim(plainTitle(title).replace(/(^|\s)#[\p{L}\p{N}_\-/]+/gu, "$1").replace(/\s{2,}/g, " "));
