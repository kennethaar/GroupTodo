/* Still on the list, but you have been where it sends you. */
const tourPending = () => tourSteps().filter(s => s.open && s.seen);
