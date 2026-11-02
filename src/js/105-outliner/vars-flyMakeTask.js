const flyMakeTask = (path, block) => { if (!block.state) { block.state = "TODO"; applyTodoTemplate(block); runTemplateRules(block, "status", "TODO"); stampAddedIfMissing(path, block); } };
