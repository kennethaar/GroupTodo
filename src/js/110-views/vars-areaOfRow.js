const areaOfRow = r => inSpace(r.space, () => areaOfProject(r.path)) || "";
