/* #408 One round: tell each shown area where I am and hear who else is
   there. Without a name there is nobody to show, so nothing is sent. */
async function hereRound() {
  const id = hereId();
  for (const space of visibleSpaces()) {
    const be = LOADED.get(space)?.backend, name = hereName(space);
    if (!be || !name) { HERE.others.delete(space); continue; }
    const {page, title} = herePlace(space);
    try {
      let list = null;
      if (be.here) list = await be.here({id, name, page, title});
      else if (be.readDir) {
        const mine = ".here/" + id + ".md", line = [name, page, title].join("\u0000"), last = HERE.wrote.get(space);
        if (!last || last.line !== line || Date.now() - last.at > HERE_FILE_MS - 5000) {
          await be.write(mine, "name:: " + name + "\npage:: " + page + "\ntitle:: " + title + "\nat:: " + new Date().toISOString() + "\n");
          HERE.wrote.set(space, {line, at: Date.now()});
        }
        list = [];
        for (const [file, text] of await be.readDir(".here")) {
          if (file === id + ".md") continue;
          const prop = k => trim((new RegExp("^" + k + "::[ \\t]*(.*)$", "m").exec(text) || [])[1] || "");
          const at = Date.parse(prop("at"));
          if (prop("name") && at && Date.now() - at < HERE_FILE_STALE_MS) list.push({name: prop("name"), page: prop("page"), title: prop("title")});
        }
      }
      if (list) HERE.others.set(space, list.filter(o => o && o.name && !isMe(o.name)));
    } catch (_) {
      HERE.others.delete(space);              // a server or folder away: nobody shown, no message
    }
  }
  for (const space of [...HERE.others.keys()]) if (!visibleSpaces().includes(space)) HERE.others.delete(space);
  hereDraw();
}
