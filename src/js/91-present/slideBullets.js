/* The bullets shown so far: the last one lit, the earlier ones dimmed, the
   ones to come already in their places but still black, so nothing moves
   when one comes. The last bullet of a slide is never dimmed, since the next
   step is a slide. Before the first bullet the slide is its title alone. */
function slideBullets(slide, step, fresh) {
  [...slide.querySelectorAll(".sbullets > .bullet")].forEach((li, n) => {
    li.classList.toggle("now", n === step.k - 1);
    li.classList.toggle("past", n < step.k - 1);
    li.classList.toggle("later", n >= step.k);
    li.classList.toggle("fresh", !!fresh && n === step.k - 1);
  });
  slideLay(slide, step.k > 0);
}
