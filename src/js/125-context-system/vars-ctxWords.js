/* A new context that looks like one already there -- @Phones beside @phone,
   @Errnd beside @errand, @Kitchen beside @home/kitchen -- is most likely the
   same place twice, which splits what you can do there in two. So it is
   merged into the old one as soon as the line naming it is written, and the
   toast's Undo brings it back. Only the last part of the name is compared,
   and the folders it is in or holds never count. */
const ctxWords = s => areaWords(String(s).split("/").pop());
