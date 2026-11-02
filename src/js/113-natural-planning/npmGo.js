function npmGo(step, q = 0) {
  NPM.step = Math.max(0, Math.min(step, NPM_STEPS.length - 1));
  NPM.q = q; NPM.naming = false; NPM_PENDING = null;
  npmSave(); render();
}
