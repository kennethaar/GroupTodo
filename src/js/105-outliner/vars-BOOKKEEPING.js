/* What a line says about itself under its words: when it is due, whether it
   comes back, who has it, how much has been said on it -- and any value of
   its own that is not bookkeeping. Added::, by::, started:: and the rest are
   the file's business and stay there. */
const BOOKKEEPING = /^(id|template_(source|rules)|added|by|started|closed|done_by|assigned_at|created|updated|updated_by|asked|feature_.*|scheduled|deadline|due|repeat|assigned|branch_sync_id|copied_from|space_sync_.*|cal_.*|stage|until|remind|expired|expire|hold|clarified)$/i;
