// When a picture was made: the stamp saveAsset put in its name, or the file's own date.
function assetTime(path, blob) {
  const m = /-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})(?:-[a-z0-9]{4})?\.[A-Za-z0-9]+$/.exec(path);
  if (m) return new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6]).getTime();
  return blob && blob.lastModified ? blob.lastModified : 0;
}
