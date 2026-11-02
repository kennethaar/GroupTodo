/* How far back to look, in days, chosen per area. Active and waiting
   projects are always looked at: an old one still active is still what you
   are doing. The window is for someday ones, by when they were last touched,
   and completed ones, by when they were done; one of those would be reopened. */
const PLAN_BACK = [["0", "None of them"], ["90", "The last 3 months"], ["182", "The last 6 months"], ["365", "The last year"],
  ["730", "The last 2 years"], ["all", "Any time"]];
const planBackOf = space => PREF.get("plan.back:" + (space || ""), "90");
