function appLog(text) {
  APP_LOG.push(new Date().toISOString() + "  " + text);
  if (APP_LOG.length > APP_LOG_MAX) APP_LOG.splice(0, APP_LOG.length - APP_LOG_MAX);
}
