/* Saves are serialised through one chain and each one captures the backend
   and page map it started with. Without that, switching space mid-save wrote
   one space's pages through another space's backend. */
let flushChain = Promise.resolve();

/* Set by Start afresh, between the wipe and the reload. Without it a focus
   event or a pending debounce could write the vault straight back into the
   storage we just emptied, and beforeunload below would argue with the
   reload. See 151_START AFRESH. */
let WIPING = false;
