const permissionLapsed = e =>
  !!e && (e.name === "NotAllowedError" || e.name === "SecurityError");
