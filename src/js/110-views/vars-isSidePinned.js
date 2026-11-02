const isSidePinned = (space, path) => { const p = sidePin(); return !!p && !p.branch && p.path === path && (p.space || "") === (space || ""); };
