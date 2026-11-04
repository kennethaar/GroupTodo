const putsBack = path => /^(yes|true|1)$/i.test(trim(getPage(path)?.props?.putback || ""));
