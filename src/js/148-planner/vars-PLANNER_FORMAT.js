/* ============================================================
   148_PLANNER -- an area's projects, sent to Microsoft Planner (experimental)
   Some of the people you work with live in Planner: one card per project,
   sorted into buckets by key account. Rather than bring them over, an area
   can send its projects there. The app cannot reach Planner itself -- the CSP
   allows nothing but localhost -- so the folder carries it: the app writes
   planner/outbox.json, a Power Automate flow on the Microsoft side applies it
   and writes planner/state.json back. docs/planner-sync.md has the format and
   the flow. Phase 1 only sends; what comes back is which card is which, kept
   as planner_id:: on the project page.

   One person's computer sends (planner_by:: in the area's settings), so two
   people never write the outbox at once. A new outbox waits until the flow has
   answered the last one, or until it is clearly not going to, so a card is
   never created twice because the answer had not arrived yet.
   ============================================================ */
const PLANNER_FORMAT = "grouptodo-planner/1";
const PLANNER_OUTBOX = "planner/outbox.json";
const PLANNER_STATE = "planner/state.json";
const PLANNER_SENT = "planner/sent.json";
const PLANNER_ID_PROP = "planner_id";
const PLANNER_DIVIDER = "---- from GroupToDo, replaced on every sync ----";
const PLANNER_NO_ACCOUNT = "No account";
const PLANNER_CHECKLIST_MAX = 20;      // Planner's own limit
const PLANNER_STALE_MIN = 30;          // a flow silent this long is taken to have failed
const PLANNER_RECENT_DAYS = 14;
const PLANNER_EVERY_MS = 2 * 60 * 1000;
const PLANNER_DOC = "https://github.com/" + LANG_GITHUB + "/blob/HEAD/docs/planner-sync.md";
const PLANNER_PROGRESS = {"1": "inProgress", "3": "inProgress", "2": "notStarted", "0": "completed", "-": "completed"};
const PLANNER_PERCENT = {notStarted: 0, inProgress: 50, completed: 100};
const PLANNER_STATUS_WORDS = {"1": "Active", "3": "Waiting for", "2": "Someday / maybe", "0": "Completed", "-": "Cancelled"};
const PLANNER_NOTE = new Map();        // area -> {level, text, when}, for Vault & sync
const PLANNER_BUSY = new Set();

/* Read without settingsPage(), which would make a GTD.md in every area it is asked about. */
const plannerSender = () => trim(String(getPage(SETTINGS_PATH)?.props?.planner_by || ""));
const plannerIsMine = () => !!plannerSender() && samePerson(plannerSender(), whoAmI());
