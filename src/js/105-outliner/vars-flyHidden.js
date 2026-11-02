/* The menu shows when it was asked for -- the ⋯ on the line, Ctrl+., or an Alt
   key that opened one row -- or always, for those who switched it on in Help.
   Never over the suggestion list. */
const flyHidden = () => !!(SUGGEST && SUGGEST.host === FLY.txt) || (!flyOn() && !FLY.open && !FLY.summoned);
