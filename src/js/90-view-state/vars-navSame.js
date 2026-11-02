const navSame = (a, b) => !!a && !!b && a.space === b.space
  && (a.branch || null) === (b.branch || null)
  && NAV_FIELDS.every(k => (a[k] ?? null) === (b[k] ?? null));
