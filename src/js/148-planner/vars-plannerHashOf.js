const plannerHashOf = c =>
  plannerHash(JSON.stringify([c.title, c.bucket, c.progress, c.start, c.due, c.assignees, c.notes, c.checklist]));
