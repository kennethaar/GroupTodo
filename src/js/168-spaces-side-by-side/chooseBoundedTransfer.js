function chooseBoundedTransfer(plan, target, opts) {
  const f = boundedTransferFields(plan, target, opts);
  return askTransfer("Move, copy or sync a page and the journal lines about it", f.body, f.collect);
}
