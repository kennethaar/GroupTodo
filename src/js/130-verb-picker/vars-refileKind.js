const refileKind = p => statusDirOf(p) ? "project · " + STATUS_LABEL[statusDirOf(p)].toLowerCase()
  : p.startsWith(DIRS.contexts + "/") ? "context" : "responsibility";
