/* ---------- duplicate lines ----------
   The same line written twice under the same parent -- a template poured in
   twice, a paste that went in again, two devices that both kept a copy -- is
   one line. The second copy goes; whatever was under it moves to the bottom of
   the first, and its values fill any the first did not have, so nothing
   written goes with it. A line whose id::, meeting or synced copy differs from
   the other's is a different line that happens to read the same, and stays.
   Comments are never duplicates: two people can say "Agreed". */
const DEDUP_IDENTITY = ["id", "cal_uid", "branch_sync_id", "space_sync_id"];
const dedupKey = b => (b.state || "") + "\u0000" + trim(String(b.title || "")).replace(/\s+/g, " ");
