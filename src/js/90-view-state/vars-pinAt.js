const pinAt = (space, path) => pins().findIndex(p => (p.space || "") === (space || "") && p.path === path);
const isPinned = path => pinAt(V.space, path) >= 0;
