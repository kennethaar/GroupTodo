/* A task type: its name and its stages, one per line. The two starters are the
   ones everybody has -- something bought and something read. */
const STATE_LIST_STARTERS = {
  Purchase: ["Ordered (waiting)", "Awaiting delivery (waiting)", "Delivered (done)"],
  Reading:  ["To read (to do)", "Reading (doing)", "Done reading (done)"],
};
