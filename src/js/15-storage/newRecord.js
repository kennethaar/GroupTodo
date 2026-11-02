function newRecord(name, backend) {
  return {name, backend, pages: new Map(), raw: new Map(), dirty: new Set(), removed: new Set(),
          offline: null};
}
