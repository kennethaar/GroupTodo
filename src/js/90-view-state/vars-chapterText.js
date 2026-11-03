const chapterText = path => proseOf(getPage(path)?.blocks);

/* ---------- scenes (#243) ----------
   A ## line in a chapter starts a scene, and the scene runs to the next one:
   the lines under its ## line and the lines after it, the way an outliner and
   a markdown editor both write it. Values on the ## line say what the scene
   is: pov:: who sees it, with:: who else is in it, place::, when:: in the
   story (a date, a year, Day 3: anything), plot:: the plotlines it moves on,
   synopsis:: what happens. Lines before the first ## are a scene with no name,
   if they have words. */
const SCENE_RE = /^##[ \t]+(?=\S)/;
const isSceneHead = b => !!b && !b.state && /^##(?!#)[ \t]+\S/.test(b.title || "");
const sceneName = b => trim(String(b.title || "").replace(SCENE_RE, ""));
const SCENE_FIELDS = [["pov", "Who sees it"], ["with", "Who else is in it"], ["place", "Where"],
  ["when", "When in the story"], ["plot", "Plotlines"], ["synopsis", "What happens"]];
// The values that name somebody or something, as links or with commas between.
const SCENE_NAMED = new Set(["pov", "with", "place", "plot"]);
