const boardSelHas = (kind, id) =>
  BOARD_SEL.kind === kind && BOARD_SEL.ids.has(String(id));
