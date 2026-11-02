const openGraphNode = nd => nd.ghost ? inSpace(nd.space, () => followLink(nd.ref)) : openPageIn(nd.space, nd.path);
