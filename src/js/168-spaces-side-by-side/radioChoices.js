function radioChoices(name, choices, current, onPick) {
  return choices.map(([value, label]) => {
    const radio = el("input", {type: "radio", name, onchange: () => onPick(value)});
    radio.checked = value === current;
    return el("label", {class: "space-transfer-choice"}, radio, " " + label);
  });
}
