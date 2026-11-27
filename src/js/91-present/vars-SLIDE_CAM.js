/* Your camera over the talk (#485): the modes C goes through, in order, and
   their names in the presenter window's Camera strip. "pic" is no mode of its
   own: a slide's picture shows first, and the camera takes its place after
   the time picked in the strip (PREF present.campic, in seconds; 0 at once). */
const SLIDE_CAM_MODES = ["big", "side", "bubble", "off"];
const SLIDE_CAM_NAMES = {big: "Big", side: "Side", bubble: "Bubble", off: "Off"};
const SLIDE_CAM_WAITS = [5, 10, 20, 0];
