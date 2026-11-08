/* Who a waiting-for row is owed by, as Waiting for groups it. */
const WAIT_NOBODY = "Nobody named";
const waitName = a => a.mention || a.assignee || WAIT_NOBODY;
