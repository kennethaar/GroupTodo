const hasTag = (title, tag) => tagsIn(title).some(t => t.toLowerCase() === String(tag).toLowerCase());
const withTag = (title, tag) => hasTag(title, tag) ? title : trim(title) + " #" + tag;
