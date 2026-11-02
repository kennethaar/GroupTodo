function installMeetingReminders() {
  setInterval(meetingTick, 20000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) meetingTick(); });
  setTimeout(meetingTick, 1500);
}
