/* Every headline on the review page folds, folded until you open it: the
   page reads as its headlines, and you open the one you are working on.
   What you opened is kept on this device. */
// The three parts of the review, as David Allen names them; a section of the steps list is one by its word.
const REVIEW_PHASES = [["clear", "Get clear"], ["current", "Get current"], ["creative", "Get creative"]];
const reviewOpened = () => new Set(PREF.get("review.open", "").split("\n").filter(Boolean));
