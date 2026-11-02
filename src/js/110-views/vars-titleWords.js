// The words of a line worth comparing, cut to their stems, so "invoice" meets "invoices".
const titleWords = s => new Set(plainTitle(String(s)).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 3).map(w => w.slice(0, 5)));
