/* A (map) slide (#488). A line that starts with an emoji is a pin, drawn as
   that emoji (📍 🔵 🟠 ⭐); its words are its name. Pins closer than
   SLIDE_PIN_SAME (% of the slide) are one pin. New pins stand in a row
   over the middle until Alt+drag places them (at:: x,y, % of the slide). */
const SLIDE_PIN_RE = /^(\p{Extended_Pictographic}️?)\s*(.*)$/u;
const SLIDE_PIN_SAME = 1.5;
const SLIDE_PIN_ROW = 8;   // new pins a row
