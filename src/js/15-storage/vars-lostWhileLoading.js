const lostWhileLoading = (record, lost) => {
  if (lost) notify(lost + " change(s) to " + spaceLabel(record.name) + " made while it was still loading " +
                   "could not be kept. Please make them again.", "warn");
};
