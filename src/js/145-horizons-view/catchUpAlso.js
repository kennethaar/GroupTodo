/* Catch up's Also look for (#516): your own lines for the prompt, such as a
   kind of work only yours has, kept per area. Saved with value; read without. */
function catchUpAlso(value) {
  const key = "catchup.also:" + (V.space || "");
  if (value !== undefined) PREF.set(key, String(value));
  return PREF.get(key, "") || "";
}
