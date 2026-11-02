/* Every area being read in from its folder right now. A calendar import waits
   for these: one written into a page before its file is read would be laid
   back over the file, and the meetings deleted there would come back. */
const READING = new Set();
