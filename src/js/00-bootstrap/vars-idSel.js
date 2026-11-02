const idSel = (cls, id, part) => cls + '[data-id="' + CSS.escape(String(id)) + '"] ' + part;

/* A drop that moves eight cards is one piece of news, not eight. Code doing a
   batch of ordinary single moves mutes the per-item toasts and says the one
   thing itself. Warnings and errors still get through -- a failure in the
   middle of a batch is exactly what you need to hear about. */
let NOTIFY_MUTE = 0;
