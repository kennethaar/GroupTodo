function openClockEditor(path, block) {
  const space = V.space;
  let entries = clockEntries(block);
  const others = otherClockEntries(block);
  const latest = entries.slice().sort((x, y) => y.start - x.start)[0];
  let day = latest ? isoOf(latest.start) : todayISO();
  const minOf = d => d.getHours() * 60 + d.getMinutes();
  const snap = m => Math.round(m / CLOCK_SNAP) * CLOCK_SNAP;
  const onDay = (m, d = day) => clockAt(d, 0, 0).getTime() + m * 60000;
  // A running clock is drawn up to now, or to the end of the day it started on.
  const shownEnd = c => c.end || (isoOf(c.start) === todayISO() ? new Date() : clockAt(isoOf(c.start), 23, 59, 59));
  const hhmm = d => pad2(d.getHours()) + ":" + pad2(d.getMinutes());

  const dayIn = el("input", {type: "date", value: day,
    onchange: e => { day = e.target.value || todayISO(); draw(); scrollToDay(); }});
  const hours = el("div", {class: "clkhours"});
  for (let h = 1; h < 24; h++) hours.append(el("span", {style: "top:" + h * CLOCK_HOUR_PX + "px"}, pad2(h) + ":00"));
  const col = el("div", {class: "clkday", title: "Drag down the day to add a stretch"});
  const scroller = el("div", {class: "clkscroll"}, hours, col);
  const list = el("div", {class: "clklist"});
  const sum = el("span", {class: "clksum"});

  const span = (c, cls, ...kids) => {
    const top = minOf(c.start), end = shownEnd(c);
    const bottom = isoOf(end) === day ? minOf(end) : 1440;
    return el("div", {class: cls,
      style: "top:" + top * CLOCK_HOUR_PX / 60 + "px;height:" + Math.max(10, (bottom - top) * CLOCK_HOUR_PX / 60) + "px"}, ...kids);
  };
  function drawBoxes() {
    col.textContent = "";
    const theirs = others.filter(c => isoOf(c.start) === day);
    col.classList.toggle("shared", theirs.length > 0);
    for (const c of theirs) {
      const box = span(c, "clkbox other", el("span", {}, hhmm(c.start) + " " + c.title));
      box.title = c.title + ", " + hhmm(c.start) + "–" + (c.end ? hhmm(c.end) : "running");
      col.append(box);
    }
    /* Between the last thing that ended and a stretch of this one, a + pulls
       the stretch's start back to that end, so the day has no hole in it. */
    entries.forEach(c => {
      if (isoOf(c.start) !== day) return;
      const before = [...theirs, ...entries.filter(x => x !== c && isoOf(x.start) === day)]
        .map(x => ({end: shownEnd(x), title: x.title}))
        .filter(x => x.end <= c.start && isoOf(x.end) === day)
        .sort((x, y) => y.end - x.end)[0];
      if (!before || c.start - before.end < CLOCK_SNAP * 60000) return;
      const gap = span({start: before.end, end: c.start}, "clkgap",
        el("button", {class: "clkfill", type: "button",
          title: "Start this at " + hhmm(before.end) + ", when " + (before.title ? "\u201C" + before.title + "\u201D" : "the stretch before") + " ended",
          "aria-label": "Start this at " + hhmm(before.end),
          onclick: e => { e.stopPropagation(); c.start = new Date(before.end); draw(); }}, "+"));
      gap.addEventListener("pointerdown", e => e.stopPropagation());
      col.append(gap);
    });
    entries.forEach((c, i) => {
      if (isoOf(c.start) !== day) return;
      const top = minOf(c.start), end = shownEnd(c);
      const bottom = isoOf(end) === day ? minOf(end) : 1440;
      const box = el("div", {class: "clkbox" + (c.end ? "" : " run"), "data-i": String(i),
        style: "top:" + top * CLOCK_HOUR_PX / 60 + "px;height:" + Math.max(10, (bottom - top) * CLOCK_HOUR_PX / 60) + "px"},
        el("div", {class: "clkh top", "data-i": String(i), "data-edge": "start"}),
        el("span", {}, hhmm(c.start) + "–" + (c.end ? hhmm(c.end) : "running")),
        el("button", {class: "x", title: "Take this stretch off", "aria-label": "Take this stretch off",
          onpointerdown: e => e.stopPropagation(),
          onclick: e => { e.stopPropagation(); entries.splice(i, 1); draw(); }}, "✕"),
        el("div", {class: "clkh bot", "data-i": String(i), "data-edge": "end"}));
      col.append(box);
    });
  }
  function drawList() {
    list.textContent = "";
    const order = entries.map((c, i) => [c, i]).sort((x, y) => y[0].start - x[0].start);
    if (!order.length) list.append(el("div", {class: "empty"}, "No time on this task. Drag on the day above to add some."));
    for (const [c, i] of order) {
      const d = isoOf(c.start);
      const from = clockInput(hhmm(c.start), {onchange: e => {
        if (e.target.value && !readClock(e.target.value)) return;
        const [h, m] = (e.target.value || "00:00").split(":");
        const len = c.end ? c.end - c.start : 0;
        c.start = clockAt(d, h, m);
        if (c.end) c.end = new Date(c.start.getTime() + len);
        draw();
      }});
      const to = clockInput(c.end ? hhmm(c.end) : "", {title: c.end ? "" : "Still running. Give it an end to stop it",
        onchange: e => {
          if (!e.target.value) { c.end = null; draw(); return; }
          if (!readClock(e.target.value)) return;
          const [h, m] = e.target.value.split(":");
          let z = clockAt(d, h, m);
          if (z <= c.start) z = clockAt(shiftISO(d, 1), h, m);      // past midnight
          c.end = z;
          draw();
        }});
      const min = Math.max(0, Math.round((shownEnd(c) - c.start) / 60000));
      list.append(el("div", {class: "clkrow" + (d === day ? " on" : "")},
        el("button", {class: "textbtn", title: "Show this day above",
          onclick: () => { day = d; dayIn.value = d; draw(); scrollToDay(); }}, humanDate(d)),
        from, el("span", {}, "–"), to,
        el("span", {class: "clkmin"}, (fmtMinutes(min) || "0 m") + (c.end ? "" : " running")),
        el("button", {class: "textbtn", title: "Take this stretch off", "aria-label": "Take this stretch off",
          onclick: () => { entries.splice(i, 1); draw(); }}, "✕")));
    }
    const all = entries.reduce((n, c) => n + Math.max(0, Math.round((shownEnd(c) - c.start) / 60000)), 0);
    sum.textContent = entries.length ? "In all " + (fmtMinutes(all) || "0 m") : "";
  }
  function draw() { drawBoxes(); drawList(); }
  function scrollToDay() {
    const first = [...entries, ...others].filter(c => isoOf(c.start) === day).sort((x, y) => x.start - y.start)[0];
    scroller.scrollTop = Math.max(0, ((first ? minOf(first.start) : 8 * 60) - 60) * CLOCK_HOUR_PX / 60);
  }

  // Dragging: a new stretch from empty day, a box moved, or one edge of it.
  let drag = null;
  const minuteAt = e => Math.min(1440, Math.max(0, snap((e.clientY - col.getBoundingClientRect().top) * 60 / CLOCK_HOUR_PX)));
  col.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    const at = minuteAt(e);
    const edge = e.target.dataset.edge, box = e.target.closest(".clkbox:not(.other)");
    if (box) {
      const c = entries[+box.dataset.i];
      drag = {c, mode: edge || "move", from: at, start: c.start.getTime(), end: c.end && c.end.getTime()};
    } else {
      const c = {start: new Date(onDay(at)), end: new Date(onDay(Math.min(1440, at + CLOCK_SNAP)))};
      entries.push(c);
      drag = {c, mode: "new", from: at, moved: false};
    }
    col.setPointerCapture(e.pointerId);
    e.preventDefault();
    draw();
  });
  col.addEventListener("pointermove", e => {
    if (!drag) return;
    const at = minuteAt(e), c = drag.c;
    if (drag.mode === "new") {
      drag.moved = drag.moved || at !== drag.from;
      const a = Math.min(at, drag.from), z = Math.max(at, drag.from + CLOCK_SNAP);
      c.start = new Date(onDay(a)); c.end = new Date(onDay(Math.max(z, a + CLOCK_SNAP)));
    } else if (drag.mode === "move") {
      const shift = (at - drag.from) * 60000;
      c.start = new Date(drag.start + shift);
      if (drag.end) c.end = new Date(drag.end + shift);
    } else if (drag.mode === "start") {
      const z = shownEnd(c).getTime();
      c.start = new Date(Math.min(onDay(at, isoOf(c.start)), z - CLOCK_SNAP * 60000));
    } else {
      // Pulling the end of a running clock stops it there.
      c.end = new Date(Math.max(onDay(at, isoOf(c.start)), c.start.getTime() + CLOCK_SNAP * 60000));
    }
    drawBoxes();
  });
  const drop = () => {
    if (!drag) return;
    // A click on the empty day, not a drag, makes half an hour.
    if (drag.mode === "new" && !drag.moved) drag.c.end = new Date(drag.c.start.getTime() + 30 * 60000);
    drag = null;
    draw();
  };
  col.addEventListener("pointerup", drop);
  col.addEventListener("pointercancel", drop);

  draw();
  modal({center: true, title: "Time on " + titleForRow(block.title),
    hint: "drag on the day to add",
    body: el("div", {class: "clked"},
      el("div", {class: "field", style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
        el("label", {style: "margin:0"}, "Day"), dayIn,
        el("button", {class: "textbtn", onclick: () => { day = shiftISO(day, -1); dayIn.value = day; draw(); scrollToDay(); }}, "‹"),
        el("button", {class: "textbtn", onclick: () => { day = shiftISO(day, 1); dayIn.value = day; draw(); scrollToDay(); }}, "›"),
        el("div", {style: "flex:1"}), sum),
      scroller,
      el("div", {class: "field", style: "margin-top:10px"}, el("label", {}, "Every stretch"), list)),
    foot: [
      el("button", {class: "btn ghost", title: "Take every stretch off this task",
        onclick: () => { entries = []; draw(); }}, "Clear all"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        inSpace(space, () => { writeClockEntries(block, entries); touch(path); });
        closeModal(); render();
        notify(entries.length ? "Time saved." : "Every stretch is off this task.");
      }}, "Save"),
    ]});
  requestAnimationFrame(scrollToDay);
}
