/* True only when there is real work in progress to protect. The quickadd box
   holds focus for most of a session, so treating any focused field as an edit
   blocked nearly every background sync; what matters is whether anything has
   been typed into it. */
function busyEditing() {
  if (document.querySelector(".modal")) return true;
  const a = document.activeElement;
  if (!a) return false;
  if (a.isContentEditable) return true;
  if (a.tagName === "INPUT" || a.tagName === "TEXTAREA") return !!trim(a.value || "");
  return false;
}
