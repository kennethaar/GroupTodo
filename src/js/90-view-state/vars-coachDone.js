const coachDone = step => PREF.get("coach." + step, "") === "1";
/* A surname is what makes a shared list readable, so the first step asks for
   one -- but the step can still be crossed off by hand like any other. */
const hasFullName = n => trim(n || "").split(/\s+/).filter(Boolean).length >= 2;
