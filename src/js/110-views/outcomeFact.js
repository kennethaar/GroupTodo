function outcomeFact(path) {
  const out = outcomeOf(path);
  return {
    key: "outcome", raw: "outcome:: " + (out || ""),
    save: v => {
      const m = /::\s*([\s\S]*)$/.exec(v);
      const text = trim(m ? m[1] : v);
      if (text) setOutcome(path, text);
      else { const p = getPage(path); delete p.props.outcome; touch(path); notify("Outcome taken off."); }
    },
    pills: () => [factPill(out || "+ write outcome", "fout", "Write the desired outcome",
      () => openProjectField({space: V.space, path}, "outcome"))],
  };
}
