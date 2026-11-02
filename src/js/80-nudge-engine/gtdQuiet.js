function gtdQuiet() {
  if (QUIET_CACHE === null) {
    // The tour's own steps do not count: eight of them would otherwise switch
    // the method nudges on before the newcomer has written a single task.
    QUIET_CACHE = leafActions().filter(a => OPEN_STATES[a.state] && !a.tourStep).length
                  < CFG.quietUntilTasks;
  }
  return QUIET_CACHE;
}
