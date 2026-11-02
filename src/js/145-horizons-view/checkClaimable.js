/* Called once a name is known and a space is loaded. */
function checkClaimable() {
  const me = whoAmI();
  if (!me) return;
  const items = claimableFor(me);
  if (!items.length) return;
  let waited = 0;
  const show = () => {
    if (!$("#modalRoot").firstChild && !busyEditing()) return openClaimPrompt(items, me);
    if ((waited += 1500) > 60000) return;
    setTimeout(show, 1500);
  };
  setTimeout(show, 700);
}
