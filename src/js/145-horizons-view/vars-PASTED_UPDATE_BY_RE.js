/* A date in a pasted update (#373): only one said as a date, after by, on,
   due, until or before: "delivered by Friday", "due 28 Nov". */
const PASTED_UPDATE_BY_RE = /\b(?:by|on|due|until|before)\s+((?:\d{1,2}[./ ]\s*)?[A-Za-z0-9]+(?:[./ ]\d{1,2}(?![\d:]))?)/i;
