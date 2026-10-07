# GroupTodo

A GTD system that is **one HTML file** and **plain markdown**. No build, no
install, no account, and no connection to anything on the internet — enforced by
a Content-Security-Policy, not just promised. The only network call it can make
at all is to an optional sync server on your own machine.

**Spaces** keep the parts of your life apart: Work, Private, Volunteer. Each is a
complete separate vault, so colleagues who get Work never see Private.

Two front doors over the same files:

- **Simple** — a to-do list. My day, todos, projects, contexts, checklists, and
  a *Big picture* view if you ever want it. Reads like Microsoft To Do.
- **Advanced** — daily journals, outliner, `[[links]]`, backlinks, zettel. Reads
  like Logseq.

Switch any time from the sidebar. The markdown on disk is identical either way.

It began as a Neovim + org-mode + org-roam config; the status directories, the
Phys-Viz verb rule, the context links, the age tracking and the morning/weekly
rituals all survive the move.

```
index.html             the entire app -- open it and it runs
sw.js                  offline + share-sheet support when it is served from a URL
manifest.webmanifest   home-screen icon, own window, "open .md with GroupTodo"
icon.svg               that icon
serve.py               optional always-on sync server (Termux, Pi, NAS)
```

`index.html` on its own is the whole app. The other three turn it into something
a phone keeps on its home screen; see **Running it** below.

---

## First run

**One screen, two doors.**

- **Start a new list** — straight in, with the task box already focused.
- **Open one I was sent** — a colleague's shared folder, or the vault file they
  sent you. This is the door to use when somebody hands you their work.

A quiet third option at the bottom, *I use Logseq or org-mode*, switches to
advanced and runs the fuller setup: spaces, then a folder for each.

**The teaching is in the page, not in front of it.** A three-step strip — add a
task, tick it off, give your tasks a home — ticks itself off as you actually do
each one, then disappears for good. While it is running the sidebar shows four
entries rather than thirteen; the rest appears once you are through it.

**Nothing is seeded.** No demo project, no demo tasks, no areas, no contexts. An
empty list is less to understand than somebody else's.

**GTD's vocabulary stays quiet until it is about something.** Below six open
tasks, simple mode shows no hygiene nudges, no *no verb* / *no context* chips on
rows, and no context picker when you re-open a task. Past that the method wakes
up, and in plain words: *tasks that don't say what to actually do* rather than
*actions without a physical verb*. The threshold is `CFG.quietUntilTasks`.

Day one has no morning weeding and no weekly-review nag.

---

## Running it

There are two ways, and the difference matters more on a phone than on a desktop.

### A. One downloaded file

Open `index.html`. That is the whole install. It works from a file on disk, a USB
stick, a network share — double-click and go. Nothing else is needed, and nothing
can phone home.

What a `file://` page is not allowed to do: register a service worker, appear in
the system share sheet, or be installed to a home screen. So on a phone this
route means saving the vault file through the browser's own download UI, which is
clumsy but works.

### B. From a URL — the no-install app

Put all four files (`index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`) on
any static host and open the URL. There is nothing to install, on any platform:

```bash
# locally, to see what it does
cd GroupTodo && python3 -m http.server 8000
# then open http://127.0.0.1:8000/
```

Any of these will do, because nothing server-side is required — no PHP, no Node,
no database, no build step:

- GitHub Pages, Netlify, Cloudflare Pages, a `~/public_html`
- a company intranet path, an IIS folder, a SharePoint document library served
  as a site, a file server over HTTP
- `serve.py` on your own phone or Raspberry Pi
- localhost, for a desktop

What the URL buys you, on every platform:

- **Add to Home Screen** gives it an icon and its own window — no app store, no
  APK, no `.dmg`, no MDM approval. It is a web page the OS treats as an app.
- **It opens with no network at all.** After the first visit the service worker
  keeps the page; the vault was never on the network in the first place. Plane
  mode, dead server, Android having reclaimed Termux — it still opens with your
  data in it.
- **The phone's own Share panel carries the vault file** (the "share sheet"). *Vault & sync → Send vault file*
  hands the markdown straight to Dropbox, Drive, OneDrive, Nextcloud, Syncthing,
  Signal or mail — whichever you already have. Those apps are the sync GroupTodo
  deliberately does not have.
- **Markdown opens in GroupTodo.** Share a `.md` into it from another app, or
  open one with it from a file manager, and it merges into your vault.
- **Storage is durable**, where a `file://` page's often is not (see the iOS note).

Updating is a refresh: replace `index.html` on the host and every device picks it
up next time it has a connection.

**It is still not a service.** The page comes from a URL; the data never does.
The Content-Security-Policy permits no outbound connection except to localhost,
so whoever hosts the file sees that you fetched a page, and nothing else — no
tasks, no projects, no account, because there is no account.

### SharePoint and Teams are file storage, not a web host

Worth settling before you try it: uploading `index.html` to a Teams channel or a
SharePoint document library does **not** give you a hosted app. Those render an
uploaded HTML file inside `<iframe sandbox srcdoc>` with no `allow-same-origin`,
which means an opaque origin — reading `window.localStorage` *throws* rather than
returning empty, there is no IndexedDB, no folder picker, and not even a
download. The page runs, so it looks like it worked, and then nothing you type
survives the tab.

GroupTodo detects that frame and says so on the first screen instead of letting
you fill a list that cannot be saved. Reproduced and verified in headless
Chromium against a real sandboxed `srcdoc` frame.

The useful part of Teams is the other tab: a channel's **Files** folder is a
SharePoint folder, and channel membership is the permission model. Hit **Sync**
on it and it becomes a real folder in File Explorer — point a space at that and
every member of the channel shares the vault, with no IT ticket and nothing
public. Storage solved, hosting still separate.

### Where to host it, and what the host can see

Hosting does not put your tasks anywhere. The link serves the **empty app**; the
vault is written to your folder or kept in your own browser. The whole codebase
makes six network calls, all of them to `./api/*` on the optional local sync
server, and `connect-src 'self' http://127.0.0.1:* http://localhost:*` blocks
every other destination — a host you typed by hand included, unless it is
localhost. There is no analytics, no error reporting, no remote font or script.

What a host **does** see is the ordinary web-server trail: your IP address, the
time, your browser, and that you requested `index.html`, `sw.js`,
`manifest.webmanifest`, `icon.svg` and `api/ping` (which 404s away from
`serve.py`). Not a single task. That trail is harmless for a work to-do list and
is not nothing if the point is that nobody knows you use this at all.

So pick by who should not know:

| Host | Public? | Good for |
|---|---|---|
| Company intranet, SharePoint site, internal web folder | no — authenticated, inside the company | work |
| Cloudflare Pages + Cloudflare Access, or any static host behind a login | no — gated by email or SSO | private, volunteer, anything sensitive |
| A Pi or NAS on your own network, reached over Tailscale or the LAN | no — never leaves your network | full control |
| `serve.py` in Termux on the phone itself | no — nothing leaves the device | one phone, maximum paranoia |
| GitHub Pages, Netlify, Cloudflare Pages (open) | the app is, your data is not | convenience, nothing sensitive |

**And remember the PC needs no host at all.** A downloaded `index.html` opened from
disk gives desktop Chrome and Edge the full experience, the live folder of `.md`
files included. Hosting exists for phones, which cannot open folders and cannot
keep storage for a `file://` page. If a public link bothers you, host it somewhere
private for the phones and keep the file on disk for the desktops.

### Why not a "real" app?

Because every other way of shipping this is an install. Flutter, React Native,
Tauri, Electron, a Go binary, a terminal app: each means a per-platform build, an
app store or a signed binary, and in a corporate environment a conversation with
whoever controls MDM. A browser is the only runtime already present and already
permitted on iOS, Android, Windows, macOS and Linux at once. So route B *is* the
cross-platform no-install app — HTML is the delivery mechanism for that, not a
constraint for its own sake.

The honest cost: no phone browser can write into a folder you choose. On desktop
Chrome and Edge GroupTodo writes your `.md` files live into a real folder; on
iOS and Android the vault lives in the app's own storage and travels as one
markdown file through the share sheet. That is a browser limit, and a native app
would be the only way around it — at the price of being an install.

### What each platform can do

Capabilities are **probed at runtime**, not assumed — open **Vault & sync** and
the top panel tells you exactly what this device allows. The short version:

| | Runs standalone | Stores locally | Live folder of `.md` | Vault file out | Home screen | Opens offline |
|---|---|---|---|---|---|---|
| Windows / macOS / Linux, Chrome or Edge | yes | yes | yes | one-click link | yes (served) | yes (served) |
| Windows / macOS / Linux, Firefox | yes | yes | no | Save / Open | no | yes (served) |
| Android, Chrome | yes | yes | no | share sheet | yes (served) | yes (served) |
| iOS / iPadOS, Safari | yes | see note | no | share sheet | yes (served) | yes (served) |

"Served" means route B above — opened from a URL rather than as a downloaded
file. Everything in the last two columns needs it, because a `file://` page may
not register a service worker.

**iOS note.** Safari restricts storage for pages opened directly from the Files
app. If it does, GroupTodo says so in plain words at startup and in Vault &
sync, and keeps working in memory for the session — you just need to save the
vault file before closing the tab. Serving the file from any URL removes the
restriction entirely, so on iPhone and iPad **serving it is the better path**.

I verified the Chromium behaviours on this list directly, including the
service-worker offline cycle and the shared-file merge against a plain
`python3 -m http.server`. **Safari and Firefox I could not test** — no engine
available in my environment — so those rows come from documented behaviour, and
the app's own runtime probe is the authority on your actual device. The share
sheet in particular is reported by the browser (`navigator.canShare`) rather than
assumed: where it is missing, the button says *Save vault file* and downloads.

---

## Spaces — keeping work, private and volunteer apart

A space is a **complete, self-contained vault**: its own journals, projects,
contexts, checklists and its own horizons, right up to its own purpose and
vision. Your Work space has Work's areas of focus; your Private space has its
own.

That matters for sharing. **The unit you hand over is a whole space** — a folder
you share in OneDrive or Dropbox, or one exported markdown file. Nothing from any
other space is inside it:

- Each space stores its files in its own place, chosen separately. Work can live
  in the company OneDrive while Private lives in iCloud and never touches it.
- Each space exports to its own file: `grouptodo-work.md`, `grouptodo-private.md`.
- Browser storage is namespaced per space.

The separation is a folder and file boundary, not a filter in the UI that someone
could switch off. Verified by test: an export of Work contains no Private content
and vice versa.

Spaces are a power feature, so a plain **Start a new list** never mentions them:
you get one space and a task box. They are set up by the wizard behind *I use
Logseq or org-mode*, or added any time from the space switcher at the top of the
sidebar.

Once there is more than one, GroupTodo asks **where each space lives**, and asks
again at startup for any space that still has no folder. Reachable later from the
space switcher → *Folders*. On the simple path the same question is the third
step of the getting-started strip instead of a dialog.

**One folder each, enforced.** Two spaces can never share a folder, and one can
never sit inside another. Both are refused with an explanation, not a warning you
can click past:

- the same folder would put Work and Private in one place — share it and you
  share both;
- a nested folder is worse, because the outer space walks its whole tree and
  would read and sync the inner space's files as its own.

Identity and containment are tested with the File System Access API's
`isSameEntry()` and `resolve()`, so it holds even though the browser never
reveals a path. A vault that already has an overlapping pair is reported at
startup. Two spaces also cannot point at the same sync server.

Giving a space a folder **moves what it already holds into it**; nothing is left
behind in browser storage. Browsers without folder access (Safari, Firefox,
mobile) are told so once and keep each space in its own browser storage, synced
through its own vault file.

**A space with no folder writes no files.** The sidebar says `browser only - no
files` rather than something that sounds like a destination, so you are never
hunting a file explorer for pages that were never written. When the page is
served by `serve.py`, the first space uses that server automatically and its
files land in the vault folder straight away.

### Giving each space its own colour

A space's colour is how you tell its rows apart when several are on screen at
once, so it is worth choosing rather than accepting. Pick one when you create the
space, from the dot on the right of its row in the space switcher, or in
**Vault & sync → Colour of <space>**. Twelve swatches, or any hex at all through
the colour well or by typing it.

A preview shows the two places the colour is actually used — the sidebar avatar
and the badge rows carry when spaces share the screen — and warns you when a
colour is too close to the page behind it to read, following whichever of the
light and dark themes you are in. The letter in the avatar flips between dark and
light ink by measured contrast, so a near-black colour stays legible.

New spaces still get a colour without being asked: the first six cycle as you
create them. Like the visibility toggles, colours are stored per device and never
inside a space, so they do not travel in a folder or a file you share.

### Sharing one project

**share** on a project page exports that project alone as a markdown file. The
dialog lists every page going into the file, with block counts, before it writes
anything — you see the manifest rather than trusting it.

- **Project page only** by default. Pages it links to (context, area, goal,
  source template) are an opt-in tick. **Journals are never included**, even when
  they reference the project: a day's page is mixed content and would carry
  everything else in it.
- **Remove who did what** strips `by::`, `done_by::` and `updated_by::` from the
  copy you send. Off by default.
- **GroupTodo file** merges into the recipient's vault through *Open vault file*,
  so they can edit and send it back. **Plain markdown** is readable in any editor
  but does not round-trip.

It is a copy, not a permission: once sent, they keep it. No revoke, no expiry.

### Recording nothing

A space can be set to **record no attribution at all** — Vault & sync → *Do not
record who did what in this space*. No `by::`, `done_by::` or `updated_by::` is
written there whatever name you have set. It lives in that space's own settings,
so it holds for everyone sharing it, not just your device. Turning it on also
offers to strip the stamps already in the space.

Use it where a signed, timestamped record of who did what is itself the risk.

### What GroupTodo does not do

It has **no accounts and no permissions of its own**. Whoever can open the folder
or the file can read and change everything in that space. The sharing controls
are your cloud drive's — share the Work folder with colleagues, and do not share
the Private one. Revoking means unsharing the folder.

### Showing one space, or several

By default you see one space at a time. In the space switcher, tick exactly the
spaces you want on screen — **any combination, including hiding the one you are
in**. Untick Work and it is gone from every list until you tick it back; the
choice is remembered across restarts.

If you hide the space you were capturing into, that role moves to a space that is
still shown. At least one space is always visible. Tapping a name makes it the
capture target: in single-space mode switching replaces what you were looking at,
in multi-space mode it joins the set.

When several are shown, every row carries a badge in that space's colour saying
which space it came from, and an edit is written back to **that** space's own files — ticking off
a Work task while Private is active updates Work, never Private. Opening a page
switches to its space, so the outliner and backlinks work where the page lives.
"Show only <space>" puts the wall straight back up.

Actions, projects and search merge across the ticked spaces. Horizons, the weekly
review and the health check stay scoped to the active space, because those
describe one life each — merging someone's work purpose with their family purpose
would be nonsense.

The toggle is stored per device, never inside a space, so it does not travel in a
shared folder. The same goes for the colours.

---

## Storage and sync — two different things

These get confused easily, so plainly:

**Storage is a folder of markdown files.** One file per day in `journals/`, one
file per page in `pages/` — projects, areas, contexts, checklists, horizons,
people, zettel. Exactly what Neovim, Obsidian and Logseq open. Desktop Chrome and
Edge write them live, as you type.

**The vault file is a courier, not a home.** It is one markdown file holding a
copy of the whole space, used only to get changes to and from a device that
cannot open a folder — which means every phone. Linking one does not change where
your files live, and a page the phone sends back lands as **its own `.md` file**
in the folder like any other.

Keep the courier **outside** the vault folder. If one ends up inside, GroupTodo
recognises it, refuses to read it as a page, and says so — but a stray copy of
your vault inside your vault is still confusing.

### The folder of files

**Vault & sync → Choose folder for *space*** (desktop Chrome / Edge). Point it at
a folder inside your cloud drive and that is the whole setup: saved as you type,
synced by the drive, readable by every other markdown tool. One space per folder,
so the folder you share is exactly what you meant to share.

Without a folder — any phone, Firefox, iOS — the space lives in the browser's own
storage and writes no files at all. The sidebar says *browser only — no files* so
you are never hunting for files that were never written.

### The courier file

No server, no account, no third party.

- **Desktop Chrome / Edge**: *Link vault file* once and the clicking is over.
  It merges when the space opens, merges again when you come back to the tab,
  and writes back about a minute after you stop typing — never mid-edit, and
  quietly unless it actually brought something in. *Sync now* still forces it,
  and *Sync by itself* turns it off.
- **Phones, served from a URL**: *Send vault file* opens the system share sheet,
  so the markdown goes straight into Dropbox, Drive, OneDrive, Nextcloud,
  Syncthing, Signal or mail. Coming back the other way, share a `.md` **into**
  GroupTodo from those same apps, or open one with it from a file manager — it
  merges on arrival. (Share-target and file-opening are Android and desktop
  Chrome; on iOS, share out, then *Open vault file* to bring one in.)
- **Everywhere else, iOS included**: *Save vault file* and *Open vault file* use
  the ordinary browser Save and Open dialogs, which reach iCloud Drive and the
  Files app like any other document.

**It merges rather than overwrites.** Every page carries an `updated::` stamp.
When a page changed on only one device, the newer side wins. When it changed on
**both** — two phones appending to the same day — the blocks are merged, matched
on their text, so every addition from both sides survives and a task you
checked off propagates instead of duplicating. Deletes travel as tombstones so a
deleted page does not come back on the next sync. Re-syncing the same file
changes nothing.

Tested: concurrent appends on two devices, check-off propagation, repeated
syncs, and deletions. All verified in headless Chromium.

### A sheet to hand to colleagues

`docs/setup-sheet.html` is the whole of this written for somebody who does not want to
know how it works: the one picture, the five steps on a computer, the four on a
phone, and the four things that actually go wrong. Open it in a browser, or put it
on the same web address as the app.

### Worked example: PC in Edge, phone in Edge, through OneDrive

The asymmetry to know up front: **desktop Edge can write into a folder you
choose; Edge on Android cannot.** No Android browser can — there is no folder
picker on the platform. So the PC keeps the real files and the phone gets the
courier.

**Once, on the PC**

1. Put the four files on a URL both devices can reach (GitHub Pages, an intranet
   path, anything static). Open it in Edge.
2. **Vault & sync → Choose folder for Work** → `OneDrive\GroupTodo\Work`.
   This is your storage: separate `.md` files from here on.
3. **Vault & sync → Link vault file** → save it as `OneDrive\GroupTodo\work-vault.md`
   — beside the Work folder, **not inside it**. This is only the phone's courier.
4. Leave **Sync by itself** on (it is on by default).

**Once, on the phone**

5. Open the same URL in Edge for Android. Menu → **Add to phone**. You now have
   an icon; after that first visit it opens with no network.

**Every day**

| You do | What happens |
|---|---|
| Type on the PC | `journals/2026-10-07.md` and the pages you touched are rewritten at once. OneDrive uploads them. A minute after you stop, the courier is refreshed too. |
| Pick up the phone, open the app | Your own copy, as you left it. |
| **Vault & sync → Open vault file** → OneDrive → `work-vault.md` | The PC's day merges in. One toast says what arrived. |
| Edit on the phone | Saved on the phone. |
| **Vault & sync → Send vault file** → share to OneDrive | The phone's version goes up. |
| Sit back down at the PC, click into the tab | The phone's edits merge on their own — no button — and each new page appears in the folder as its own `.md` file. |

So the PC end is hands-off and keeps the file-per-page layout; the phone end is
two deliberate gestures, in and out. The reason is the folder picker, not the sync.

**Three things worth knowing**

- **Merges, never overwrites.** Both sides can edit the same day and both sets of
  tasks survive; a task you ticked on the phone arrives ticked. Re-syncing the
  same file changes nothing, so an extra sync is never a risk.
- **OneDrive's share sheet may save `work-vault (1).md`** instead of replacing the
  file. Harmless — merging is by content, not filename — but tidy up
  occasionally, and on the PC open the newest one if you see several.
- **Sync before you switch devices, not after.** Nothing is lost either way; you
  just will not see the other side's work until a file has made the trip.

**If the two gestures on the phone annoy you**, the only ways to remove them are
an always-on `serve.py` plus a folder sync that actually keeps a local folder on
Android (Syncthing does; OneDrive and Drive do not), or a native app. Both are
installs, which is the thing you asked to avoid.

### Your own always-on machine, for you and your colleagues

One machine you control serves everybody. No cloud account, no third party
holding your tasks, no IT ticket, and for your colleagues nothing to install —
they open a link.

**The server needs a password before it faces anything but localhost.** It now
refuses to start otherwise rather than warning and carrying on:

```sh
# put the vault somewhere that gets backed up -- OneDrive is fine, it is only
# a folder, and this way the vault survives the laptop
export GTD_PASSWORD="$(head -c 24 /dev/urandom | base64)"   # or --password-file
python3 serve.py --vault ~/OneDrive/GroupTodo/Work          # stays on localhost
```

Then put TLS and a reachable name in front of it. Two shapes, depending on
whether your colleagues will install anything:

| | Colleagues install | Who can reach it |
|---|---|---|
| `tailscale serve --bg 8777` | Tailscale, and join your tailnet | only your devices |
| `tailscale funnel --bg 8777` | **nothing — just open the link** | anyone with the URL, so the password is the only thing in front of it |

Both give `https://yourbox.your-tailnet.ts.net`, with a real certificate, no port
forwarded and no router touched. HTTPS matters for more than privacy: it is what
makes phones treat the app as installable and able to open offline.

For somebody who does not want to hand their data to a CDN, Funnel is worth
understanding: it routes by TLS server name without terminating the connection,
so Tailscale moves bytes it cannot read. That is a genuinely different trust
position from a service that decrypts your traffic to serve it.

**What this buys everyone:** one link that works on a PC and a phone, real
`.md` files on your machine, edits sent as you make them and re-read when anyone
comes back to the app, no courier file, nothing manual.

**Five things to know before you rely on it.**

- **Is it your work laptop?** Running a service reachable from outside is likely
  against your acceptable-use policy, and endpoint security may block the
  listener regardless. Technically fine, organisationally not your call. A
  personal machine or a cheap always-on box avoids the question.
- **Sleep kills it.** A laptop that suspends on a closed lid is offline. Set it
  never to sleep while plugged in, and expect to leave it open.
- **When you travel, you are the single point of failure.** Everyone keeps
  working — the app holds its own copy, retries on a widening interval, and
  merges per page when you are back — but nobody sees anybody else's work until
  then. One cheap always-on box is the fix if that matters.
- **Basic auth is one shared password**, not accounts. Everyone who has it can
  read and rewrite the whole space, and changing it means telling everyone. It is
  a door, not a permission system.
- **Back up the vault.** It is one folder on one machine. Keeping it inside a
  synced folder costs nothing and means a dead laptop is an inconvenience rather
  than a loss.

### Also fine: Tailscale with no public URL at all

If you have a machine that is usually on — a Linux box, a Pi, a NAS — this beats
every other arrangement here, and it is the only one that is genuinely live.

```sh
# on the Linux box
python3 serve.py --vault ~/vaults/work           # stays on 127.0.0.1
tailscale serve --bg 8777                        # https://box.your-tailnet.ts.net/
```

Then open that HTTPS address on the PC and on the phone. Both talk to the same
vault, so there is no courier file and nothing to remember:

- **Real `.md` files, one per day and one per page**, on the box — the same files
  Neovim opens there.
- **Live both ways.** Each device sends its edits as you make them, and re-reads
  the vault whenever you come back to the app, so the other device's work is
  there when you look. A page deleted on one device stays deleted on the other.
- **Phones get everything**: home-screen icon, opens with no network, durable
  storage. That needs a secure origin, which is exactly what `tailscale serve`
  provides and a bare `http://100.x.y.z:8777` does not.
- **Nothing public.** Only your tailnet can reach it. No cloud account, no
  third party, no port forwarded.
- **`serve.py` stays bound to `127.0.0.1`** — Tailscale proxies to it, so you
  never need `--host 0.0.0.0` and the no-authentication warning never applies.

Two things to know. The app must be served by the *same* `serve.py` that holds
the vault: `connect-src` permits `'self'` and localhost only, so the app loaded
from one address cannot be pointed at a server on another. And everyone on your
tailnet can read and write the vault — `serve.py` has no login of its own, so
share the node, not the tailnet.

**On a corporate phone**, Tailscale is an ordinary app-store install, so it
usually passes where Termux does not. Watch for two blockers: Android runs one
VPN at a time, so a company always-on VPN will shut Tailscale out, and a work
profile does not share the personal profile's VPN — the browser and Tailscale
have to live in the same profile.

### Alternative: a sync server

For an always-on box (Termux on Android, a Pi, a NAS):

```sh
python3 serve.py --vault ~/storage/shared/Documents/OrgMode
# open http://127.0.0.1:8777/
```

Same `.md` files Neovim opens. No auth — keep it on `127.0.0.1` unless you trust
the network.

**On Android, in full:**

```sh
# Termux from F-Droid, NOT the Play Store version (that one is abandoned)
pkg update && pkg install python git
termux-setup-storage                 # once: grants ~/storage/shared
git clone https://github.com/kennethaar/GroupTodo ~/GroupTodo
cd ~/GroupTodo
termux-wake-lock                     # stop Android suspending the server
python3 serve.py --vault ~/storage/shared/Documents/OrgMode
```

Then open Chrome at `http://127.0.0.1:8777/` and *Add to Home screen*.

`serve.py` and `index.html` must sit in the same folder — the server serves the
page from its own directory. The vault is separate and can be anywhere.

Android kills background apps, and if Termux dies the server goes with it. The
app is built to shrug that off:

- **It still opens.** The server installs a service worker the first time you
  visit, so the page afterwards comes from the browser's own cache.
  `http://127.0.0.1` counts as a secure origin, which is what makes this legal.
- **Your vault is still there.** A server-backed space keeps a full mirror of
  every page in this device's storage, written *before* the server, so a save
  can never be lost to something unreachable — and so the app has a whole vault
  to open when the server is gone entirely.

A folder-backed space mirrors differently: only writes the folder has not
confirmed yet. It needs no second copy, since the folder is already the local
one, and a full mirror there would put back anything you deleted in Neovim or
Explorer — to a full mirror a page missing from the folder looks like a page the
folder has never seen. Unconfirmed-only means external deletes stick, while work
still survives a folder that loses permission or gets unplugged mid-session.
- **You can keep working.** Edits made while the server is down are saved locally
  — the status line says `saved on device` — and are sent up, merged by
  `updated::`, the next time it answers.

Verified end to end in headless Chromium against a real `serve.py` vault: killed
the server, closed the tab, reopened the app with nothing running, found the
tasks still there, added another, restarted the server, and watched that new task
land in `journals/`.

`termux-wake-lock` and exempting Termux from battery optimisation are still worth
doing — the above is a safety net, not a reason to let the server die.

---

## Corporate environments

- **One file, no dependencies.** Nothing to install, nothing to approve, no CDN,
  no fonts, no analytics, no telemetry.
- **It cannot phone home, and that is enforced, not promised.** The page ships a
  Content-Security-Policy that permits no outbound connection except to
  `localhost` for the optional sync server. Grep it yourself: the only `fetch`
  calls in the file target that server.
- **No service worker, no install required** — email it, drop it on a share,
  open it from disk.
- **Your data stays yours**: markdown you can read, diff and keep in git.

---

## The vault

Each space is a vault with this shape, in its own folder:

```
journals/2026-10-05.md      one file per day
pages/
  _/                        cancelled projects, and the horizon pages:
                              _/Purpose.md  (H5)   _/Vision.md  (H4)
  0/  1/  2/  3/            project status: completed, active, someday, waiting
  8/                        checklists       -> [[8/Onboard new customer]]
  a/                        areas of focus   -> [[a/Health]]       (H2)
  g/                        goals            -> [[g/Debt cleared]] (H3)
  c/                        contexts         -> [[c/phone]]
  p/  o/                    people, organisations
  z/                        zettel notes
  templates/  verbs/        templates, Phys-Viz verb lexicon
  GTD.md                    per-vault settings: started, last review,
                              tombstones, no_attribution
```

Everything is listed in the vault's own order: `_`, `0`, `1`, `2`, `3`, then `8`.

Purpose and vision are ordinary pages — `pages/_/Purpose.md`, `pages/_/Vision.md`
— so they link like anything else: `[[_/Purpose]]`. They share the `_` drawer with
cancelled projects but carry `type:: horizon`, and every project listing filters
them out, so the two never mix in the app.

A project's **status is its directory**. Changing status moves the file and
rewrites every `[[1/Fix sink]]` link in the vault to `[[0/Fix sink]]`.

```markdown
title:: Fix the sink
status:: 1 = active
outcome:: Sink repaired, no drip
area:: [[a/Home]]
updated:: 2026-10-05T09:12:00Z

- TODO Call the plumber about the leak [[c/phone]]
  Added:: [[2026-10-01]]
  SCHEDULED:: [[2026-10-08]]
- DONE Buy pipe tape [[c/errand]]
  Added:: [[2026-09-10]] - [[2026-09-12]] = 2 days
```

States: `TODO`, `DOING`, `WAIT`, `DONE`, `CANCELLED` (`WAITING`/`CANCELED`/`NOW`/
`LATER` read as aliases), or **no state at all** — an ordinary note.

Nothing is one-way. The state badge in the outline cycles
`TODO → DOING → WAIT → DONE → note → TODO`, so a line made a task by accident
goes back to being a note without retyping it, and a note becomes a task by
clicking the same spot. In simple mode the action detail has a **Not a task**
button, and a note on a project page opens the same panel. Dropping the state
also drops the task-only bookkeeping — `Added::`, `SCHEDULED::`, `DEADLINE::`,
`CLOSED::`, `done_by::` — so the markdown reads as the plain note it now is.

Cycle one click too far and nothing is lost: those properties are held in memory
for `CFG.undoStateMinutes` (5) and put back if the block becomes a task again
inside that window, with its original dates rather than today's. After the window
it starts fresh. The stash never reaches the files.

Re-opening a finished task also clears the closing stamps, so a `TODO` never
carries `- [[end]] = 35 days` or a `done_by::` claiming someone completed it. `Added::` is stamped when something becomes a TODO and
closed out with an end date and elapsed days when finished — that number drives
"oldest first" everywhere.

**One step per click, from wherever you are.** The badge on a to-do row is the
same control: clicking it moves the task on in place — `TODO → DOING → WAIT →
DONE → TODO`, staying a task, since a list has nowhere to keep a plain note. It
keeps the keyboard focus afterwards, so `space` repeats the step, and `ctrl-enter`
in the outline does the same without losing the caret. The action panel no longer
closes when you choose a state either, so three steps are three clicks rather
than three trips through the panel.

Already have an `.org` vault? It is detected and converted on request; originals
untouched.

---

## The GTD nudges

The point is that vague work is not allowed to sit quietly.

**Nothing is invented for you.** No areas, no contexts, no goals are created
behind your back. Borrowed structure is worse than none, so the app ships empty
and asks.

**Horizons of focus** — called *Big picture* in simple mode. David Allen's six
altitudes, set up by a wizard the first time you open it:

| | | |
|---|---|---|
| Horizon 5 | 50,000 ft | Purpose and principles |
| Horizon 4 | 40,000 ft | Vision, three to five years |
| Horizon 3 | 30,000 ft | Goals and objectives, one to two years |
| Horizon 2 | 20,000 ft | Areas of focus — ongoing, never "done" |
| Horizon 1 | 10,000 ft | Projects — outcomes inside a year |
| Ground | runway | Next actions |

The wizard climbs from the concrete to the abstract, because that is the order
people can actually answer in — Allen implements bottom-up even though you review
top-down. Every step is skippable, suggestions are tap-to-add, and nothing is
written until you finish. Re-run it any time from the Horizons view.

Projects hang under areas and goals under areas, so two failures become visible:
**projects in no area** (work nobody owns) and **goals with no project** (wishes).

**Projects stated as outcomes.** A project called *Website* is a noun nobody can
finish; *Website live and taking bookings* is a finish line. Creating a project
asks name, then "what does done look like?", then the next action — the whole
clarify sequence in order. Projects with no stated `outcome::` are flagged in the
nudge bar, in weeding and in the weekly review. New projects start with no
actions at all, so the "no next action" nudge asks you for a real one rather than
inventing a verb-less placeholder from the title.

**Phys-Viz verbs.** A next action must start with a verb a camera could film —
*Call*, *Draft*, *Buy*, *Ring*, *Kjøp*. Anything else is flagged and a picker
offers to rewrite it. The lexicon is markdown you own; English and Norwegian
starter sets install on request.

**Contexts are yours too.** Every action wants a `[[c/...]]` link saying where it
can be done. The first time you need one, a wizard asks where work actually
happens for you, offering common ones as suggestions you tap — nothing is created
unless you pick it. After that, setting something to TODO without a context opens
the picker, where single letters `a`–`z` select. In simple mode none of this
appears until you are past the quiet threshold.

**The surfacing loop.** Pick where you are and GroupTodo shows the **three
oldest** open actions you could actually do there. Never the newest.

**Checklists** live under `8/` — eternity, because you run them forever. Two kinds:

- A **simple checklist** drops its steps into today or into an existing project.
- A **project template** spins up a whole new project on every run. "Onboard new
  insurance customer" run once per customer gives you one project each, with the
  same choreography. Write `%name%` in any step and you are asked for it per run,
  so *Call %name% to welcome them* becomes *Call Acme Ltd to welcome them*. The
  template's `outcome::` is carried over and expanded the same way, and the new
  project records `from:: [[8/...]]` so you can see where it came from.

**Morning weeding.** Once a day, the three stalest active projects, ranked by: no
next action, then missing context, then missing verb, then idle time.

It is only ever *suggested* once there is something to rank: at least
`CFG.weedMinProjects` (5) active projects **and** `CFG.weedMinTodos` (20) open
tasks. Below either, it does not open by itself, does not appear in the sidebar,
and is not offered as the next best move. `g w` still opens it whenever you want,
and says why it is holding back.

**Idle nudge** at 30 minutes. **Context re-prompts** at 12:00 and 17:00.

**Project completion.** Close the last action in a project and it will not let it
go quiet: add a next action, or move it to `0`, `2`, or `_`.

**Weekly review.** Eight sections, each with a one-click fix. Marking it done
writes `last_review` into `pages/GTD.md`. It only starts asking once a week of
actual use has passed, counted from `started::` — day one does not open with a
red chip about a review you could not possibly have done yet.

**Who did what.** A shared space means several people editing the same markdown,
so changes carry a name and a time, written into the files themselves:

```markdown
- DONE Call Acme Ltd to welcome them
  Added:: [[2026-10-01]] - [[2026-10-05]] = 4 days
  by:: Kenneth
  done_by:: Ingrid 2026-10-05T18:43:38Z
```

Pages also carry `updated::` and `updated_by::`. Creation records the day and the
name only — no clock on a todo, because for GTD "this has sat for 14 days" is the
useful fact, not the minute it was typed.

**Timestamps are written in UTC** so colleagues in different offices compare
cleanly, and shown in **your** timezone, set per device in Vault & sync. That
setting also decides which day counts as today, so a journal written while
travelling lands on the day you think you are in.

Set your name in **Vault &
sync**; it is stored on this device, can differ per space (your full name at
work, something shorter at home), and with no name set **nothing is stamped**, so
a vault you use alone stays clean. Other people's names show as a chip on the
row; your own is not repeated back at you.

**Health check.** Missing titles, waiting projects with no `waiting_since`,
broken links, duplicate projects with a merge action.

Thresholds live in the `CFG` object near the top of the script.

**Where settings live.** Anything that belongs to the vault — when you started,
your last review, tombstones, whether the space records attribution — is written
into that space's `pages/GTD.md`, so it travels with a shared folder. Anything
that belongs to you and this device — simple or advanced, theme, timezone, your
name, which spaces are shown and their colours — stays in browser preferences and
never travels inside a space.

---

## Keys

Advanced mode keeps the leader chords from the Neovim config.

| | |
|---|---|
| `c` · `/` · `t` · `?` | capture · search · today · key list |
| `g x` / `g d` | pick context / re-surface the oldest three |
| `g w` / `g M` | morning weeding / full morning routine |
| `g r` / `g a` / `g n` | weekly review / agenda / next actions |
| `g m` | change project status |
| `f t` / `f p` / `f n` | today's / previous / next journal |
| `f r` / `f d` | rename / delete page |
| `z n` · `h c` | new zettel · health check |
| `w p` / `w w` / `w m` / `w u` | active / waiting / someday projects, mark reviewed |

In the outline: `enter` new block, `tab`/`shift-tab` indent, `ctrl-enter` cycle
state, `backspace` on an empty block deletes it.

---

## Known limits

- **Block merge matches on text.** Rewording a task on one device while the other
  edits the same page reads as a delete plus an add, so you may see both. Visible
  and fixable, never silent data loss.
- **Deleting a single task does not propagate** — only whole-page deletes carry
  tombstones. A task deleted on one device can return from another.
- **The sync server is one shared password, not accounts.** Everyone who has it
  can read and rewrite the whole space, and there is no per-person access and no
  audit of who did what beyond the `by::` stamps. Binding it anywhere but
  localhost without a password is refused.
- **Spaces are separated, not secured.** Anyone who can open a space's folder or
  file sees all of it. There is no password, and nothing is encrypted.
- **Simple mode holds the GTD nudges back** until six open tasks, so a new list
  looks emptier of advice than it will later. `CFG.quietUntilTasks` changes it.
- **Morning weeding stays hidden** under 5 active projects or 20 open tasks, in
  both modes. `g w` opens it anyway.
- **Merged view is opt-in and per device.** Structure views (horizons, review,
  health) stay on the active space even when several are shown.
- **No phone browser can write into a folder you choose.** Live `.md` folders are
  desktop Chrome/Edge only; on iOS and Android the vault lives in the app's own
  storage and leaves as one file. Only a native install would change that.
- **A document library cannot host the app.** SharePoint and Teams open an
  uploaded `.html` in a sandboxed frame with no storage; the app says so rather
  than pretending. Use the Files folder for the vault, not for the app.
- **The service worker needs a URL.** A downloaded `file://` page cannot register
  one, so offline-open, home-screen install and the share sheet all need route B.
- **Share-target and file-opening are Chromium features.** iOS can share out but
  not in; use *Open vault file* there.
- **A server space re-reads on return, not continuously.** Another device's
  work appears when you come back to the app, not while you watch. There is no
  polling and no push.
- **Two writes per save on a folder vault, briefly.** Each page goes to this
  device's storage first and to the folder second; the local copy is dropped as
  soon as the folder confirms. A server vault keeps its full copy on purpose.
- **A vault file in the vault folder is skipped, not merged.** GroupTodo spots it
  and warns, but it will not be read as a page. Keep couriers outside.
- **Auto-sync is desktop only.** It needs a file handle that survives restarts,
  which is `showSaveFilePicker` — Chrome and Edge on desktop. On a phone the
  vault file goes in and out by hand.
- **Safari and Firefox are untested by me** (see the table above).
