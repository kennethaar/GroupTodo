/* #395 tools live where you type: with a mouse and room to spare, the line
   tools sit at the end of the line being written, Type and the moves on show
   and the rest behind ＋ Insert. A phone keeps them at the foot, over the keyboard,
   where a thumb reaches them (P16). */
function editBarInline() {
  return matchMedia("(pointer:fine)").matches && innerWidth > 640;
}
