/* Whether what was just saved will still be here next time: a private
   window, or blocked site data, keeps settings for this visit only. */
const calStorageKeeps = () => safeLS.get("gtd.pref." + CAL_FEEDS_KEY) !== null;
