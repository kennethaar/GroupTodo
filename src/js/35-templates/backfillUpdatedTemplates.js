function backfillUpdatedTemplates(entries = V.pages, changedTemplates = null) {
  if (!TEMPLATE_ENGINE_READY || TEMPLATE_BACKFILL_BUSY || !V.loaded) return;
  TEMPLATE_BACKFILL_BUSY = true;
  try {
    const templatePaths = new Set(Object.keys(TEMPLATE_DEFAULTS).concat(['0','2','3','-']).map(name => readTemplate(name)).filter(Boolean));
    const rec = LOADED.get(V.space);
    for (const [path, page] of entries) {
      if (V.pages.get(path) !== page || templatePaths.has(path)) continue;
      // A page still being read is an empty stand-in: filled in from its template
      // it was a change to throw away, and a warning about it (#188).
      if (rec && stillLoading(rec, path)) continue;
      let changed = false;
      const title = page.props?.title || baseName(path);
      const code = statusDirOf(path);
      const date = isJournalPath(path) ? baseName(path) : todayISO();
      const vars = {title, date, created:todayStamp(), reviewed:todayStamp(), status:STATUS_TEXT[code] || page.props?.status || ''};
      let templatePath = page.props?.template_source;
      if (!templatePath) {
        // A day's templates are for days; a week page has none.
        if (isWeekPath(path)) templatePath = null;
        else if (isJournalPath(path)) templatePath = resolveTemplate({date,kind:'journals'})?.path;
        else if (!path.startsWith(DIRS.lists + '/') && !path.startsWith(DIRS.verbs + '/')) templatePath = readTemplate(templateKindForPage(path));
      }
      const day = isJournalPath(path) && dayOfPath(path);
      const dayTpls = day ? resolveTemplates({date: day, kind: 'journals'}) : [];
      if (dayTpls.length) {
        if (!changedTemplates || dayTpls.some(t => changedTemplates.has(t.path))) changed = backfillDayFields(page, day, dayTpls) || changed;
      } else if (templatePath && (!changedTemplates || changedTemplates.has(templatePath))) changed = backfillTemplateFields(page, templatePath, vars) || changed;
      changed = stripTemplateMachinery(page, false) || changed;
      walkBlocks(page.blocks, block => {
        if (!block.state) return;
        changed = stripTemplateMachinery(block, true) || changed;
        const taskTemplate = block.props?.template_source || readTemplate('todo');
        if (taskTemplate && (!changedTemplates || changedTemplates.has(taskTemplate))) changed = backfillTemplateFields(block, taskTemplate, {...vars,title:block.title,state:block.state}, true) || changed;
      });
      if (changed) touch(path);
    }
  } finally { TEMPLATE_BACKFILL_BUSY = false; }
}
