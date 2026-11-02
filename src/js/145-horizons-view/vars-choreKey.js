/* ---------- taking turns ----------
   Whose turn the next one is: of the people in the area, whoever has done
   this chore least lately -- counted from done_by:: on the earlier ones with
   the same words -- and on a tie, whoever did it longest ago. Only offered;
   the next one is handed over the way any task is, with assigned::. */
const choreKey = t => trim(withoutEst(plainTitle(t || ""))).toLowerCase();
