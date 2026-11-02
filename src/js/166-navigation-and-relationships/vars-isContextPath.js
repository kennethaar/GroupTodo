/* A context's children are contexts and nothing else: the ones in its folder,
   and any children:: that name a context. The tasks done there are what the
   context lists, not what it is made of. */
const isContextPath = p => String(p || "").startsWith(DIRS.contexts + "/");
