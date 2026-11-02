/* birthday:: on a person, as the day and how soon it is. The pill opens the
   calendar; a birthday without its year is typed beside it, as 03-14. */
function birthdayFact(path, k, v) {
  const b = parseBirthday(v);
  const input = el("input", {type: "date", tabindex: "-1", "aria-label": "Birthday",
    value: b && b.year ? b.year + "-" + pad2(b.month) + "-" + pad2(b.day) : "",
    onchange: e => { if (e.target.value) { saveRawProp(path, k, k + ":: " + e.target.value); render(); } }});
  const pick = () => { try { input.showPicker(); } catch (_) { writePropValue(path, k, v); } };
  return {
    key: k, raw: k + ":: " + v, own: true,
    save: text => saveRawProp(path, k, text),
    pills: () => {
      const pill = factPill(b ? birthdayWords(v) : trim(v) ? v : "+ pick a date", b ? "fquiet fbday" : "fwant fbday",
        "Pick the date. Without the year, click beside it and write " + k + ":: 03-14", pick);
      pill.append(input);
      return [pill];
    },
  };
}
