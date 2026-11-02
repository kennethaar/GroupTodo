// What this device is: what you said, else what the browser says.
function senseDevice() {
  const said = PREF.get("sense.device", "");
  if (said === "pc" || said === "phone") return said;
  const ua = navigator.userAgentData;
  if (ua && typeof ua.mobile === "boolean") return ua.mobile ? "phone" : "pc";
  return onPhone() ? "phone" : "pc";
}
