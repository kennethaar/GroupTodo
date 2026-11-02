const isMemberPage = path => trim(String(getPage(path)?.props?.member || "")) === "true";
