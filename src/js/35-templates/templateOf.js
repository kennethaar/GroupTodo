/* Rules and feature flags are read from the template itself, never copied
   into the item: a task does not carry its template's machinery around. */
function templateOf(item) { return item?.props?.template_source || (item?.state ? readTemplate("todo") : null); }
