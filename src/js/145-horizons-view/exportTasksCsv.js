function exportTasksCsv(rows, what) {
  if (!rows.length) { notify("Nothing to export here.", "warn"); return; }
  const sep = csvSeparator();
  const line = cells => cells.map(v => csvCell(v, sep)).join(sep);
  const text = [line(TASK_CSV_COLUMNS.map(c => c[0])), ...rows.map(a => line(TASK_CSV_COLUMNS.map(c => c[1](a))))];
  const name = "grouptodo-" + what + "-" + todayISO() + ".csv";
  downloadText(name, "﻿" + text.join("\r\n") + "\r\n", "text/csv;charset=utf-8");
  notify(rows.length + (rows.length === 1 ? " task" : " tasks") + " saved as " + name + ". It opens in Excel.");
}
