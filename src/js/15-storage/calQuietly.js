function calQuietly(fn) { CAL_OWN_EDIT++; try { return fn(); } finally { CAL_OWN_EDIT--; } }
