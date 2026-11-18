/* The bullets shown so far: the last one lit, the earlier ones dimmed. The
   last bullet of a slide is never dimmed, since the next step is a slide. */
function slideBullets(slide, step, fresh) {
  const ul = slide.querySelector(".sbullets");
  const lis = [...ul.children];
  while (lis.length > step.k) lis.pop().remove();
  for (let n = lis.length; n < step.k; n++) {
    const li = el("li", {class: "bullet" + (fresh && n === step.k - 1 ? " fresh" : "")}, slideWords(step.s.kids[n]));
    ul.append(li);
    lis.push(li);
  }
  lis.forEach((li, n) => {
    li.classList.toggle("now", n === step.k - 1);
    li.classList.toggle("past", n < step.k - 1);
    if (!(fresh && n === step.k - 1)) li.classList.remove("fresh");
  });
  slideFit(slide);
}
