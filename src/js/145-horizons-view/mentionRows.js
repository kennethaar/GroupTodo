function mentionRows() {
  return memo("mentionRows", () => {
    const me = whoAmI(), out = [];
    for (const a of myOpen()) {
      const seen = [];
      for (const name of peopleOnLine(a.block || a)) {
        if (samePerson(name, me) || (a.assignee && samePerson(name, a.assignee)) || seen.some(n => samePerson(n, name))) continue;
        seen.push(name);
        out.push(Object.assign({}, a, {mention: name}));
      }
    }
    return out;
  });
}
