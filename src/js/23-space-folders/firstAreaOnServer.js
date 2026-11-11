/* Does the first area at a new address go into serve.py's folder unasked?
   Only where nothing else could hold it: a browser that cannot pick a folder.
   Anywhere else the welcome screen asks, and offers the server folder there
   beside a folder of your own (#356). */
function firstAreaOnServer(server) {
  return !!server && !CAP.dirPicker;
}
