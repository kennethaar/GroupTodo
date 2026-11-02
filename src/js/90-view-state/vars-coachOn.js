/* ============================================================
   113b_FIRST_RUN COACH
   Three steps that tick themselves off as you do them, in the page rather
   than in front of it. Teaching by doing beats a wall of modals, and it
   disappears for good once every step it shows is done or crossed off.
   ============================================================ */
const coachOn = () => PREF.get("coach", "") === "1";
