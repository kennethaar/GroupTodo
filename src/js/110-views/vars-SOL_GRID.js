/* Row by row, the way the numpad reads: 7 8 9 / 4 5 6 / 1 2 3. */
const SOL_GRID = ["7", "8", "9", "4", "CARD", "6", "1", "2", "3"];
/* Where a box grows from when it is enlarged: from its own corner or edge,
   so every box grows inwards over the table and none off the screen. */
const SOL_ORIGIN = i => [(i % 3) / 2, Math.floor(i / 3) / 2];
