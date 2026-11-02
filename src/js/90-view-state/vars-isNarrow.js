/* ---------- the sidebar, out of the way ----------
   Hidden is remembered per device. On a phone the sidebar is a drawer and
   the burger pulls it out instead. */
const isNarrow = () => matchMedia("(max-width:820px)").matches;
