/* The bullets shown so far: the last one lit, the earlier ones dimmed, the
   ones to come already in their places but still black, so nothing moves
   when one comes. The last bullet of a slide is never dimmed, since the next
   step is a slide. Before the first bullet the slide is its title alone; the
   first one fades in once the title has moved to the top. */
function slideBullets(slide, step, fresh) {
  // A table's header (or first column) shows with the title, so it is laid out from the start (#469).
  const moved = slideLay(slide, step.k > 0 || step.s.layout === "table");
  for (const c of slide.querySelectorAll("[data-tpart]")) {
    const n = +c.dataset.tpart;
    c.classList.toggle("now", n === step.k - 1);
    c.classList.toggle("past", n < step.k - 1);
    c.classList.toggle("later", n >= step.k);
  }
  // A drawn layout's parts light the same way, all of them faint until then (#433).
  [...slide.querySelectorAll(".sbullets > .bullet, .part")].forEach((li, n) => {
    li.classList.toggle("now", n === step.k - 1);
    li.classList.toggle("past", n < step.k - 1);
    li.classList.toggle("later", n >= step.k);
    li.classList.toggle("fresh", !!fresh && n === step.k - 1);
    li.classList.toggle("aftertitle", !!fresh && moved && n === step.k - 1);
  });
  // A hub's card for the lit spoke, the others hidden (#433).
  const lit = slide.querySelector(".part.now")?.dataset.bid;
  for (const c of slide.querySelectorAll(".hubcard")) c.classList.toggle("on", c.dataset.bid === lit);
  // The lit part's picture in the picture's place (#464).
  const pic = slidePicNow(step.s, step.k);
  for (const p of slide.querySelectorAll(".cover .pic")) p.classList.toggle("on", p.dataset.pic === pic);
}
