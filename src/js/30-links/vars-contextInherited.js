/* True when the context shown for a line comes from a line above it. */
const contextInherited = b => !!b && !hasContextLink(b.title) && !!blockContext(b);
