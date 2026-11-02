/* What a card of this kind is worth knowing: what it is called, and how much of
   the vault actually mentions it -- which is the honest answer to "can I let go
   of this one". */
/* Open tasks per context, counted once rather than once per context card. */
const openPerContext = () => memo("openPerContext", () => {
  const n = new Map();
  for (const a of leafActions()) if (a.context && OPEN_STATES[a.state]) n.set(a.context, (n.get(a.context) || 0) + 1);
  return n;
});
