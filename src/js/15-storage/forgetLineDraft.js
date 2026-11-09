function forgetLineDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (_) {} drawSync(); }
