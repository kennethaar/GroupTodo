const insideLink = before => before.lastIndexOf("[[") > before.lastIndexOf("]]");

/* The folders a prefix can mean, in the order the vault itself uses them. */
const linkDirFor = pfx => PREFIX_DIR[pfx] || STATUS_DIRS[pfx] || null;
