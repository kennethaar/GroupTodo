function calSkips(page) { return new Set(trim(page?.props?.cal_deleted || "").split(/[\s,]+/).filter(Boolean)); }
