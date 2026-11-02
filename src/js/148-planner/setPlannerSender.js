function setPlannerSender(name) {
  const page = settingsPage();
  if (trim(name || "")) page.props.planner_by = trim(name);
  else delete page.props.planner_by;
  touch(SETTINGS_PATH);
}
