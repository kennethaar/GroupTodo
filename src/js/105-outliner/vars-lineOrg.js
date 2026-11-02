const lineOrg = block => (linksIn(block.title).map(l => trim(l.split("][")[0])).find(l => l.startsWith("o/")) || "").slice(2);
