/* The morning review waits on Today rather than calling out when the app
   opens: there on a day it is worth it, gone once finished with Done or put
   away. Opening it is not finishing it -- going off to fix a task leaves the
   box behind, saying it can be resumed. Kept on this device, since it is
   your morning and not the area's. */
const MORNING_KEY = "morning.done";
const MORNING_BEGUN = "morning.begun";
const morningDue = () => weedingWorthIt() && PREF.get(MORNING_KEY, "") !== todayISO() &&
  !!dateIn(getSetting("started")) && dateIn(getSetting("started")) !== todayISO();
