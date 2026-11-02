/* Quickest first, and a task nobody has sized after every one somebody has. */
const byEst = (x, y) => (estOfRow(x) || 9) - (estOfRow(y) || 9);
