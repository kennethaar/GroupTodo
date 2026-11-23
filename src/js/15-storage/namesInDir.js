/* The file names straight inside dir among keys that are whole paths
   (#483): "assets/slides/a.jpg" is "a.jpg" in "assets/slides"; a file in a
   folder under it is not. */
function namesInDir(keys, dir) {
  const pre = String(dir).replace(/\/+$/, "") + "/";
  return keys.map(String).filter(k => k.startsWith(pre) && !k.slice(pre.length).includes("/")).map(k => k.slice(pre.length));
}
