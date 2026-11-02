/* The other areas one calendar's meetings show in, and where one meeting
   shows: what was chosen for it (cal_share::, "-" for nowhere else), or else
   what its calendar says. */
const calAlso = f => (f?.also || []).filter(n => n !== calHome());
const calFeedOf = feed => calFeeds().find(f => calFeedId(f.url) === feed);
const calOwnShare = b => trim(blockProp(b, "cal_share") || "");
