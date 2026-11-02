function templateKindForPage(path) {
  const status = statusDirOf(path);
  if (status) return status;
  const ref = pageRef(path), prefix = ref.includes("/") ? ref.split("/")[0] : "page";
  return STATUS_DIRS[prefix] || PREFIX_DIR[prefix] ? prefix : "page";
}
