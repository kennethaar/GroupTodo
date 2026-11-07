/* The next prompt in a deck; the place in each deck is kept in the draft. */
function npmDraw(key, n) {
  NPM[key] = ((NPM[key] || 0) + 1) % n;
  npmSave(); render();
}
