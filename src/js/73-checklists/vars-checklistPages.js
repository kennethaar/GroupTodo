const checklistPages = () => allPages(p => pageKind(p) === "checklist");
const isRoutine = path => !!trim(getPage(path)?.props?.cadence || "");
const cadenceOf = path => trim(getPage(path)?.props?.cadence || "");

/* ---------- routines that come round by themselves ----------
   A routine whose cadence:: is a rule (parseRule) is put on your day page on
   the days it falls, the way Add it to a page would: the steps under one line
   naming the list. Only today is filled, and only once -- a day you did not
   open the app is a day it was skipped, never a pile waiting for you -- so a
   change to the routine is in the next one and every one after it. The rest
   is plain lines on the routine's page:

       cadence:: every weekday       the rule; "as needed" is not one
       starts:: [[2026-11-02]]       the first day it may fall on
       ends:: [[2026-12-31]]         or: after 10
       time:: 08:00                  the steps are scheduled at that time
       runs:: 3                      how many times it has come round
       last_run:: [[2026-10-28]]     so a day is filled once */
const ROUTINE_OWN_PROPS = ["cadence", "starts", "ends", "time", "runs", "last_run"];
/* A list that can come round: not a task type, not a project template, and not
   the weekly review, which has its own screen. */
const canSchedule = path => pageKind(path) === "checklist" && !isStateList(path) && !isProjectTemplate(path) && path !== REVIEW_LIST_PATH;
