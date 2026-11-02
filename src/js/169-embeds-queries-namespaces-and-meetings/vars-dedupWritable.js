/* Only the pages you may write to: another person's day page is theirs. */
const dedupWritable = path => !isJournalPath(path) || !journalOwnerOf(path) || myJournal(path);
