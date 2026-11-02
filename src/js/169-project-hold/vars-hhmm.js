const hhmm = ms => { const d = new Date(ms); return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); };
