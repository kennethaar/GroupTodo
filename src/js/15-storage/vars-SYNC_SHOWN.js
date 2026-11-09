/* What the sync line was last told, so a line being typed (or no longer
   being typed) can be laid over it without a save having to run (#337).
   SAVED_AT is the time of the last save that finished: "All saved to disk"
   with no time looks the same before a change as after it. */
let SYNC_SHOWN = ["ok", ""];
let SAVED_AT = "";
