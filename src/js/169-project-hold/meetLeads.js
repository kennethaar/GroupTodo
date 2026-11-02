function meetLeads(b) { return isMeeting(b) && !blockProp(b, "date") && !!meetingClock(b); }
