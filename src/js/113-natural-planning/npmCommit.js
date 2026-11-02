function npmCommit() { const f = NPM_PENDING; NPM_PENDING = null; if (f) f(); }
