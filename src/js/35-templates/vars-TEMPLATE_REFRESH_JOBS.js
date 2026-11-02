/* Coalesce template edits and yield between small batches. Navigation never scans the vault. */
const TEMPLATE_REFRESH_JOBS = new Map();
