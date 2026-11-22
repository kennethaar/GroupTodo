/* Widgets kept up to date by themselves: read when the app opens and each
   time it comes back on screen, where a tick in a widget is likeliest (#474). */
function installWidgets() {
  scheduleWidgets(true);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) scheduleWidgets(true); });
}
