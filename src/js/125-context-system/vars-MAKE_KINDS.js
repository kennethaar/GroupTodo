const MAKE_KINDS = {
  task:    {alt: "t", label: "Make it a task",       detail: "TODO"},
  project: {alt: "1", label: "Make it a project",    detail: "[[1/…]]", kind: "project", noun: "project"},
  person:  {alt: "p", label: "Link a person",        detail: "[[p/…]]", kind: "person",  noun: "person"},
  org:     {alt: "o", label: "Link an organisation", detail: "[[o/…]]", kind: "org",     noun: "organisation"},
  context: {alt: "c", label: "Give it a context",    detail: "[[c/…]]", kind: "context"},
};
MAKE_KINDS.zettel = {alt:"z",label:"Link a concept / Zettelkasten note",detail:"[[z/…]]",kind:"zettel",noun:"note"};
const KIND_PREFIX = {project: "1/", person: "p/", org: "o/", context: "c/", zettel:"z/", area: "a/"};
