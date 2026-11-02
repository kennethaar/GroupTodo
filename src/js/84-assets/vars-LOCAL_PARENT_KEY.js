/* ---------- a folder dropped on a line ----------
   A folder cannot be copied into assets/, so it becomes a link to where it
   is: [Folder name](file:///C:/...). Ctrl held does the same for files, for a
   document that should stay where it lives. No browser tells a page where a
   dropped thing came from -- only its name -- so the path is asked for once,
   with the last folder used put in front of the name, ready to confirm. A
   path from Explorer's "Copy as path" pastes straight in, quotes and all. */
const LOCAL_PARENT_KEY = "gtd.localParent";
