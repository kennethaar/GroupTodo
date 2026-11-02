function saveReadSet(set) {
  // Keep it from growing without limit; the oldest keys are the least useful.
  const keys = Array.from(set).slice(-800);
  PREF.set(readKey(), JSON.stringify(keys));
  MEMO.delete("readSet:" + readKey());
}
