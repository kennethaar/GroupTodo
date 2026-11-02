/* ============================================================
   126_WHERE_AM_I -- a context guessed from the device
   Picking where you are is the step people skip, and then Next shows
   everything. A browser can tell three things that help: whether it runs on
   a phone or a PC, whether a phone is on wifi or the mobile network (Chrome
   on Android only), and, once you allow it, where it is. It cannot read the
   wifi's name, so the home wifi is a saved spot instead. A few questions
   turn these into a context. It is offered rather than switched behind your
   back, unless you say so. All of it stays on this device: a position has
   no business in a folder others share.
   ============================================================ */
const SENSE_DEFAULTS = {
  pc:    ["computer", "pc", "office", "laptop"],
  phone: ["home", "phone"],
  away:  ["errand", "errands", "out", "anywhere"],
};
const senseOn = () => PREF.get("sense.on", "") === "1";
const senseAuto = () => PREF.get("sense.auto", "") === "1";
