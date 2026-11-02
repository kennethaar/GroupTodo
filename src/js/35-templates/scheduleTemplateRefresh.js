function scheduleTemplateRefresh(templatePath = null) {
  if (!TEMPLATE_ENGINE_READY || !V.loaded) return;
  const pages = V.pages;
  let job = TEMPLATE_REFRESH_JOBS.get(pages);
  if (job) {
    if (!templatePath) job.all = true;
    else job.paths.add(templatePath);
    job.restart = true;
    return;
  }
  job = {pages, space:V.space, all:!templatePath, paths:new Set(templatePath ? [templatePath] : []),
    iterator:pages.entries(), restart:false, changed:false};
  TEMPLATE_REFRESH_JOBS.set(pages,job);
  const enqueue = () => setTimeout(step, 16);
  const step = () => {
    if (V.pages !== pages || V.space !== job.space) { TEMPLATE_REFRESH_JOBS.delete(pages); return; }
    const started = performance.now();
    let count = 0, done = false;
    while (count < 20 && performance.now() - started < 6) {
      const next = job.iterator.next();
      if (next.done) { done = true; break; }
      const [path,page] = next.value;
      const before = page.props?.updated;
      backfillUpdatedTemplates([[path,page]],job.all ? null : job.paths);
      if (page.props?.updated !== before) job.changed = true;
      count++;
    }
    if (!done) { enqueue(); return; }
    if (job.restart) { job.restart=false; job.iterator=pages.entries(); enqueue(); return; }
    TEMPLATE_REFRESH_JOBS.delete(pages);
    // Do not replace an editor while the user is typing.
    if (job.changed && !document.activeElement?.isContentEditable &&
        !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '')) render();
  };
  enqueue();
}
