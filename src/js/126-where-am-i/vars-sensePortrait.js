const sensePortrait = () => { try { return matchMedia("(orientation: portrait)").matches; } catch (_) { return true; } };
