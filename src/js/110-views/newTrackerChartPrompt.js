function newTrackerChartPrompt(name) {
  promptInput({title: "New chart", label: "Name", placeholder: "Drinks", cta: "Save",
    onSave: v => { if (trim(v)) { setTrackerChart(name, v); render(); } }});
}
