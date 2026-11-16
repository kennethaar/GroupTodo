/* The day in a note someone reads later (#402): Sun 15 Nov, with the year
   when it is another year. */
const doneNoteDay = day => dateFormat(day.slice(0, 4) === todayISO().slice(0, 4)).format(parseISO(day));
