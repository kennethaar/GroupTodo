addEventListener("resize", editBarPlace);
if (window.visualViewport) for (const ev of ["resize", "scroll"]) visualViewport.addEventListener(ev, editBarPlace);

/* The menu never covers the words of the line it is about, wrapped lines
   included, and sits above everything else on the page. It goes under the
   line, starting where the words end, and over it when there is no room
   under. With room nowhere it takes the taller of under and over and scrolls
   inside. */
const flyOn = () => PREF.get("fly.show", "") === "1";
