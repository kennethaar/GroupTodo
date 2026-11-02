/* ============================================================
   INVITING SOMEBODY
   "Here is the app, and it already knows about our space." One file, and on
   opening it they are in, with the list in front of them.

   What a browser will NOT let us do is hand over a folder: a directory handle
   cannot be serialised or transferred, by design. So the invite carries
   everything else -- the space's name and colour, the server address when
   there is one, and a full snapshot of the vault -- and for a folder-backed
   space it names the folder and leaves one button to press. A server-backed
   space needs nothing at all: the address is in the file.
   ============================================================ */
const INVITE_TAG = "gtd:invite";
