function templateRule(text) {
  const m = /^@on\s+(review|status\s*(!=|=)\s*([^\s]+))\s*->\s*([^=;]+)=(.*?)(?:\s*;\s*(overwrite))?\s*$/.exec(trim(text));
  return m ? {event:m[1]==="review"?"review":"status",op:m[2],value:m[3],field:trim(m[4]),expression:m[5],overwrite:!!m[6]} : null;
}
