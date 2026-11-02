/* A context is a page, pages/c/<name>.md, like a person or an organisation. One
   that so far only exists as [[c/name]] on a line gets its page the first time
   you open it, in the area new things land in. */
const contextPath = name => join(DIRS.contexts, name + ".md");
