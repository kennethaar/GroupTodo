/* Stamp every edit. This single property is what lets two devices merge a
   vault through a cloud drive with no server in the middle. */
const nowStamp = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
