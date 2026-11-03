function timerPaintDial(b, drag, left, due) {
  const max = timerMax(), dragging = drag != null, len = Math.round(TIMER_LEN / 60000);
  const dial = b.querySelector(".tdial");
  // Big while a timer runs, with the alarm or without, and once it has rung until that is clicked away.
  // "grown", not "big": .big is already the app's 64 px tile and would shrink it to that.
  const big = left > 0 || due >= 0;
  if (big !== b.classList.contains("grown")) {
    b.classList.toggle("grown", big);
    const pad = big ? 0 : DIAL_PAD, box = 2 * (DIAL_C + pad);
    dial.querySelector("svg").setAttribute("viewBox", `${-pad} ${-pad} ${box} ${box}`);
  }
  /* Grown, no taller than the sidebar has room for: what the spacer above
     holds beyond its 12 px, less whatever already overflows. Not under 80 px;
     a sidebar too short for that scrolls. */
  if (big) {
    const nav = b.parentElement, grow = nav?.querySelector(".nav-grow");
    const free = nav ? nav.clientHeight - nav.scrollHeight + (grow ? grow.offsetHeight - 12 : 0) : 0;
    dial.style.setProperty("--fit", Math.max(80, dial.offsetHeight + free) + "px");
  } else dial.style.removeProperty("--fit");
  dial.querySelector(".tsector").setAttribute("d",
    dialSector(dragging ? drag.minutes / max : Math.min(1, left / (max * 60000))));
  dial.setAttribute("aria-valuenow", String(dragging ? drag.minutes : Math.ceil(left / 60000)));
  dial.setAttribute("aria-valuetext", dragging ? drag.minutes + " minutes" : left > 0 ? clock(left) + " left" : "not running");
  b.querySelector(".lbl").textContent = dragging ? drag.minutes + " min"
    : left > 0 ? clock(left) : due >= 0 ? "+" + clock(due) : "Timer";
  b.querySelector(".tsub").textContent = dragging ? (drag.sound ? "rings" : "silent") + ", starts when you let go"
    : left > 0 ? "of " + len + " min"
    : due >= 0 ? len + " min rang"
    : timerDefaultMinutes() + " min, up to " + max;
  const sound = b.querySelector('[data-part="sound"]');
  // Solid, and the wedge amber, while the alarm is on.
  const rings = dragging ? drag.sound : TIMER_SOUND;
  sound.setAttribute("aria-pressed", String(rings));
  b.classList.toggle("rings", rings);
  sound.title = rings ? "The alarm is on. Click to turn it off" : "The alarm is off. Click to turn it on";
  dial.title = due >= 0 ? "The " + len + " min alarm rang at "
      + new Date(TIMER_DUE).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
      + ", " + clock(due) + " ago. Click to dismiss"
    : timerRinging() ? "Click to silence the alarm"
    : "Click or drag round the face for up to " + max + " min. Inside the ring is silent, outside rings. "
      + (left > 0 ? "The middle stops it" : "The middle starts " + timerDefaultMinutes() + " min");
}
