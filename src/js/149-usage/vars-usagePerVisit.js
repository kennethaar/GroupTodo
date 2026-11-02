const usagePerVisit = x => !x.visits ? "" : x.secs / x.visits < 60 ? "< 1 min" : Math.round(x.secs / x.visits / 60) + " min";
