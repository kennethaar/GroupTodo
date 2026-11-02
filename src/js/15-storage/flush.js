function flush() {
  flushChain = flushChain.then(doFlush, doFlush);
  return flushChain;
}
