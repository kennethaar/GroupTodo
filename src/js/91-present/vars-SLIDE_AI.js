/* Copy for AI ▸ Slides (#483). The pictures an AI may put on slides are the
   files in the area's own assets/slides/ folder, picked by their names. */
const SLIDE_AI_DIR = "assets/slides";
const SLIDE_AI_LINK_RE = /!\[([^\]]*)\]\((assets\/slides\/[^)]*)\)/g;
/* Words a camera or a phone puts in a file name, which say nothing about
   what the picture shows: IMG_0042.jpg, DSC00012.jpg, Screenshot 2024-… */
const SLIDE_AI_CAMERA = new Set(["img", "image", "dsc", "dscn", "dscf", "pxl", "mvimg", "vid", "pano", "dji", "gopr",
  "sam", "wp", "photo", "foto", "picture", "pic", "bilde", "screenshot", "skjermbilde", "scan", "untitled", "copy", "kopi"]);
// The file names last seen in each area's assets/slides/, for the red bullet on a missing picture.
const SLIDE_AI_KNOWN = new Map();
let SLIDE_AI_DRAFT = {key: "", answer: ""};
// Copy for AI ▸ (#483), in the line menu, under picked lines and in a page's ☰ menu.
const AI_COPY_CHOICES = [["plan", "Plan"], ["slides", "Slides"]];
