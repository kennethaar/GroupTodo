/* ============================================================
   FACES AND LAST SEEN
   A picture lives in the person's own page as a data: URI, so it travels in
   the vault like everything else -- no uploads, no server, no second place for
   things to go missing. The cost is bytes in a markdown file, so the image is
   re-drawn at 96px and squeezed until it fits a hard ceiling; a 4MB photo
   becomes about 8KB of text.

   Last seen is written to the same page, at most once an hour, so colleagues
   can tell whether somebody has even opened the thing this week. A space that
   is set to record nothing records this too -- it is the same promise.
   ============================================================ */
const AVATAR_PROP = "avatar", SEEN_PROP = "last_seen";
const AVATAR_MAX = 24 * 1024;          // data: URI characters, not pixels

const personProp = (name, key) => {
  const page = V.pages.get(personPath(name));
  return page ? trim(String(page.props?.[key] || "")) : "";
};
const avatarOf = name => {
  const v = personProp(name, AVATAR_PROP);
  return /^data:image\//.test(v) ? v : "";
};
