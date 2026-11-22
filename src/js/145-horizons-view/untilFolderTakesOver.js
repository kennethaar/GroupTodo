/* While the browser copy stands in for a folder being read, a link waits for
   the folder's first pages: the page it opens at is read with today's
   (linkedPageFirst), and the copy may not have it (#474). */
async function untilFolderTakesOver(space, ms = 60000) {
  for (const end = performance.now() + ms; FOLDER_READING.has(space) && performance.now() < end;)
    await new Promise(r => setTimeout(r, 100));
}
