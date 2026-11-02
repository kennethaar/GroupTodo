/* What a door has waiting behind it this week, said on the step. */
function reviewDoorCount(id) {
  switch (id) {
    case "today": {
      const late = myOpen().filter(a => a.due && a.due < todayISO()).length;
      return late ? late + " late" : "";
    }
    case "waiting": {
      const w = waitingRows();
      const never = w.filter(a => !isMember(a.assignee) && askedDays(a.block) == null).length;
      const tell = stakeholdersDue().length;
      return [w.length ? w.length + " waiting" + (never ? ", " + never + " never asked" : "") : "",
        tell ? tell + (tell === 1 ? " stakeholder" : " stakeholders") + " due an update" : ""].filter(Boolean).join(", ");
    }
    case "solitaire": {
      const none = visibleProjects("1").filter(r => !projectActions(r).some(a => OPEN_STATES[a.state])).length;
      return none ? none + (none === 1 ? " project has" : " projects have") + " no next action" : "";
    }
    case "weeks": { const n = unfinishedPast().length; return n ? n + " left from past weeks" : ""; }
    case "reflect": { const n = reflectLog().reduce((s, d) => s + d.items.length, 0); return n ? n + " this week" : ""; }
    case "days": { const n = daysToClarify().length; return n ? n + (n === 1 ? " day" : " days") + " to go through" : ""; }
    case "someday": case "duel": { const n = visibleProjects("2").length; return n ? n + " someday/maybe" : ""; }
    case "holdduel": { const n = SD_KINDS.hold.items().length; return n ? n + " on hold, no date" : ""; }
    case "context": { const n = myOpen().filter(a => !a.context && a.state !== "WAIT").length; return n ? n + " without a context" : ""; }
    case "actions": {
      const d = actDeck(), verb = d.filter(a => a.missingVerb).length, ctx = d.filter(a => a.missingContext).length;
      return [verb ? verb + " without a verb" : "", ctx ? ctx + " without a context" : ""].filter(Boolean).join(", ");
    }
    default: return "";
  }
}
