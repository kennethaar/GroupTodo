/* ---------- prices on a line ----------
   A price is an amount with its currency next to it, written the way it is
   said: EUR 400, DKK400, 349,95 NOK, kr 1 200,-, €12. There is nothing to
   set up, and a bare number is never one, so "Call 3 people" costs nothing.
   A comma or full stop before one or two digits starts the decimals, before
   three it groups thousands. Codes are capitals, so the word nok is not money.
   A minus or brackets make it negative, DKK -150 or DKK (150), so a refund
   takes away from the total. A minus glued to a number, as in 300-400 EUR,
   is a range and not a sign. */
const PRICE_CUR = "EUR|NOK|DKK|SEK|ISK|USD|GBP|CHF|PLN|CAD|AUD|JPY|CNY|kr\\.?|€|\\$|£";
const PRICE_NUM = "\\d{1,3}(?:[ \\u00A0.,]\\d{3})+(?:[.,]\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?";
const PRICE_SIGNED = `[-\\u2212]?(?:${PRICE_NUM})|\\((?:${PRICE_NUM})\\)`;
const PRICE_SRC = `(?<![\\p{L}\\p{N}])(?:(${PRICE_CUR})[ \\u00A0]?(${PRICE_SIGNED})|(${PRICE_SIGNED})[ \\u00A0]?(${PRICE_CUR}))(?:,-)?(?![\\p{L}\\p{N}])`;
const PRICE_RE = new RegExp(PRICE_SRC, "gu");
// Links, addresses and code are not prices, even with EUR 400 in them.
const PRICE_SKIP = "\\[\\[[\\s\\S]*?\\]\\]|https?:\\/\\/[^\\s<]+|`[^`]+`";
const PRICE_SHOW_RE = new RegExp(PRICE_SKIP + "|" + PRICE_SRC, "gu");
const PRICE_SYM = {"€": "EUR", "$": "USD", "£": "GBP"};
