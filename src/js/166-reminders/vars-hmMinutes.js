const hmMinutes = hm => { const [h, m] = String(hm || "00:00").split(":").map(Number); return h * 60 + m; };
