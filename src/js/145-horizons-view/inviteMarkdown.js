/* The invite IS a vault bundle, with a config comment in front. An older copy
   of the app ignores the comment and still imports the pages. */
function inviteMarkdown() {
  return "<!-- " + INVITE_TAG + " " + JSON.stringify(inviteConfig()) + " -->\n" +
         bundleMarkdown();
}
