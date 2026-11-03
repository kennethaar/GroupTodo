const nameShown = ref => { const p = findExistingPage(ref); return p ? pageTitle(p) : String(ref).replace(/^[a-z0-9]\//i, ""); };
