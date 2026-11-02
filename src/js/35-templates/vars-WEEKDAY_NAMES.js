/* ============================================================
   35_TEMPLATES
   Port of: init.lua 20_TEMPLATE_RESOLVER -- date cascade lookup:
   2026-09-17 > 2026-W38 > 2026-Monday > 2026-Q3 > 2026-H2 > 2026-09 > 09-17 > 2026 > 09 > kind
   A weekday template always carries its year, and may be named in English
   or Norwegian: 2026-Monday or 2026-mandag.
   ============================================================ */
const WEEKDAY_NAMES = [["Sunday", "søndag"], ["Monday", "mandag"], ["Tuesday", "tirsdag"],
  ["Wednesday", "onsdag"], ["Thursday", "torsdag"], ["Friday", "fredag"], ["Saturday", "lørdag"]];
