/* ---------- when storage will not take a write ----------
   The retry below widens from three seconds to a minute, and the thing that is
   unreachable -- a closed laptop, a sleeping Pi, a server nobody started, a
   folder whose permission lapsed -- stays unreachable for minutes or hours. So
   one notice per outage, and one when it comes back; the old code said the
   same sentence on every attempt, which is how something true turns into
   something you stop reading.

   And it says WHY. "Cannot reach the storage" covers a lapsed folder
   permission, a server that is not running, a folder that has been moved and a
   disk with no room left, and there is nothing in common between what you
   would do about them. A lapsed permission gets more than a sentence: the
   folder handle is still here, so granting it again is one click, and the
   notice carries the button that asks for it. */
const spaceLabel = name => {
  try { const sp = Spaces.get(name); if (sp && sp.name) return sp.name; } catch (_) {}
  return name;
};
