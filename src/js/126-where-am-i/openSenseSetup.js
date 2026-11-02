/* The few questions. Every answer has a default, so Save on its own is a
   fair setup: a PC is @computer, a phone is @home, and out and about is
   @errand -- or the nearest context you already have. */
function openSenseSetup() {
  const lid = "senseCtxs";
  const list = el("datalist", {id: lid}, ...contextList().map(c => el("option", {value: c})));
  const ctxBox = value => el("input", {list: lid, value, autocomplete: "off", style: "max-width:220px"});
  const note = text => el("div", {style: "color:var(--fg3);font-size:12px;margin-top:4px"}, text);
  let device = senseDevice();
  const here = ctxBox(senseHere());
  const away = ctxBox(senseAway());
  const deviceSeg = segPicker([
    {key: "pc", label: "PC", blurb: "A desk or a laptop."},
    {key: "phone", label: "Phone", blurb: "It goes with you."},
  ], device, k => {
    if (here.value === senseDefault(device)) here.value = senseDefault(k);
    device = k;
  });

  let places = sensePlaces();
  const placeRows = el("div", {class: "senseplaces"});
  const drawPlaces = () => {
    placeRows.textContent = "";
    if (!places.length) placeRows.append(note("No places yet."));
    places.forEach((p, i) => placeRows.append(el("div", {class: "senseplace"},
      el("span", {}, "@" + p.ctx),
      el("span", {class: "sub"}, (p.r || 150) + " m"),
      el("button", {class: "iconbtn", title: "Forget this place", "aria-label": "Forget @" + p.ctx,
        onclick: () => { places.splice(i, 1); drawPlaces(); }}, "✕"))));
  };
  drawPlaces();
  const placeCtx = ctxBox(here.value);
  const saveSpot = el("button", {class: "btn ghost", onclick: async () => {
    const name = senseName(placeCtx.value);
    if (!name) { notify("Name the context for this place first."); return; }
    saveSpot.disabled = true;
    const pos = await sensePosition(true);
    saveSpot.disabled = false;
    if (!pos) { notify("No position. The browser said no, or the page is not on https.", "warn"); return; }
    places = places.filter(p => p.ctx !== name);
    places.push({ctx: name, lat: +pos.lat.toFixed(5), lon: +pos.lon.toFixed(5),
      r: Math.max(100, Math.min(400, Math.round((pos.acc || 0) / 50) * 50 + 100))});
    drawPlaces();
  }}, "Save this spot");

  const box = (on, label) => {
    const b = el("button", {type: "button", role: "checkbox", "aria-checked": on ? "true" : "false",
      class: "spacetoggle" + (on ? " on" : ""), onclick: () => {
        b.classList.toggle("on");
        const now = b.classList.contains("on");
        b.textContent = now ? "✓" : "";
        b.setAttribute("aria-checked", now ? "true" : "false");
      }}, on ? "✓" : "");
    return {b, row: el("div", {style: "display:flex;gap:10px;align-items:center;margin-top:6px"}, b, el("span", {}, label))};
  };
  const work = senseWork();
  const workCtx = ctxBox(work.ctx);
  workCtx.placeholder = "office";
  const workFrom = el("input", {type: "time", value: work.from, style: "width:auto"});
  const workTo = el("input", {type: "time", value: work.to, style: "width:auto"});
  const workDays = el("div", {class: "seg sensedays"});
  // Monday first, as a week is read here; getDay() counts Sunday as 0.
  [1, 2, 3, 4, 5, 6, 0].forEach(d => workDays.append(el("button", {type: "button",
    class: work.days.includes(d) ? "on" : "", "aria-pressed": work.days.includes(d) ? "true" : "false",
    data: {d}, onclick: e => {
      const on = e.currentTarget.classList.toggle("on");
      e.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
    }}, new Date(2026, 0, 4 + d).toLocaleDateString(undefined, {weekday: "short"}))));

  const onOpen = box(PREF.get("sense.set", "") ? senseOn() : true, "Check when GroupToDo opens");
  const byItself = box(senseAuto(), "Switch by itself instead of asking");

  modal({
    center: true, title: "Sense where I am",
    body: el("div", {},
      list,
      el("div", {class: "field"}, el("label", {}, "This device is a"), deviceSeg),
      el("div", {class: "field"}, el("label", {}, "On it, with no place found, you are at"), here,
        note("A PC: @computer. A phone: @home.")),
      el("div", {class: "field"}, el("label", {}, "Out and about you are at"), away,
        note("A phone off wifi, or far from your places. A browser cannot read the wifi's name.")),
      el("div", {class: "field"}, el("label", {}, "In work hours you are at"), workCtx,
        workDays,
        el("div", {style: "display:flex;gap:8px;align-items:center;margin-top:6px"},
          el("span", {}, "from"), workFrom, el("span", {}, "to"), workTo),
        note("Leave it empty for no rule. On a PC at the office: @office.")),
      el("div", {class: "field"}, el("label", {}, "Places"), placeRows,
        el("div", {style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px"},
          el("span", {}, "I am at @"), placeCtx, saveSpot),
        note("Stand there, name the context, save. Kept on this device only.")),
      el("div", {class: "field"}, onOpen.row, byItself.row)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => {
        PREF.set("sense.device", device);
        PREF.set("sense.here", senseName(here.value));
        PREF.set("sense.away", senseName(away.value));
        PREF.set("sense.work", JSON.stringify({ctx: senseName(workCtx.value),
          days: [...workDays.querySelectorAll("button.on")].map(b => +b.dataset.d),
          from: workFrom.value || SENSE_WORK.from, to: workTo.value || SENSE_WORK.to}));
        setSensePlaces(places);
        PREF.set("sense.on", onOpen.b.classList.contains("on") ? "1" : "");
        PREF.set("sense.auto", byItself.b.classList.contains("on") ? "1" : "");
        PREF.set("sense.set", todayISO());
        closeModal();
        senseNow();
      }}, "Save and sense"),
    ],
  });
}
