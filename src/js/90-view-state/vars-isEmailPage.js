const isEmailPage = path => pageKind(path) === "email" || trim(getPage(path)?.props?.type || "").toLowerCase() === "email";
