const eventOrder = (x, y) => (x.day + (x.time || "99:99")).localeCompare(y.day + (y.time || "99:99"));
