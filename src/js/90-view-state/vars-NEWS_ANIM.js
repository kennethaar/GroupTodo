/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
  "1.224.0#516": `
    cap | Catch up with an AI
    say | In the Weekly review, Get clear › Catch up with an AI.
    + pg col
    + h ln > pg | Get clear
    + b chip > h | Catch up with an AI
    p b
    w 900
    say | Copy the prompt to an AI that reads your mail and meetings. Paste its answer back.
    + l ln > pg | Project A
    + x ln > pg | [Done ▾] Send the draft
    + y ln > pg | [Next ▾] Call the supplier  @calls
    + z ln > pg | [Skip ▾] New project: Product A launch
    s x | margin-left:16px
    s y | margin-left:16px
    s z | margin-left:16px
    w 1500
    say | Each change has its GTD choice: Next, Do now, Delegate, Someday or Skip.
    + a chip > pg | Apply 2 changes
    p a
    w 1500`,
  "1.223.0#515": `
    cap | Slides in a window of their own
    say | ▶ Present opens the slides beside the page.
    + pg col
    + l ln > pg | Our plan
    + a ln > pg | • First step
    w 1200
    say | Change a line on the page: the slide shows it.
    s a | font-weight:700
    + b ln > pg | • First step, done by Friday
    c a +dim
    w 1500
    say | F or ⛶ makes the slides full screen.
    + f chip > pg | ⛶ Full screen (F)
    p f
    w 1500`,
  "1.222.0#488": `
    cap | A picture pin that travels
    say | The same picture on two lines is one pin on the map.
    + pg col
    + l ln > pg | (map) Our route 🗺
    + a ln > pg | 🖼 Oslo
    s a | margin-left:24px
    w 1200
    + b ln > pg | 🖼 Bergen
    s b | margin-left:24px
    w 900
    say | Its words are a label that moves with it. Alt+drag the label to place it apart.
    c a +dim
    w 1800`,
  "1.221.0#488": `
    cap | Move things around a map
    say | On a Map slide, write the same emoji twice.
    + pg col
    + a ln > pg | 🚗 Oslo
    + b ln > pg | 🚗 Bergen
    w 900
    say | On its click the 🚗 moves on to its new place.
    p b
    w 1200
    say | The same picture or words move the same way.
    w 1500`,
  "1.220.0#467": `
    cap | See which lines stay off the slides
    say | Hide in Present keeps a line off the slides.
    + pg col
    + a ln > pg | Opening
    + b ln > pg | Backup numbers
    + c ln > pg | Next steps
    w 900
    c b +dim
    t b | ⊘ Backup numbers
    say | It shows faded, with a closed eye in front.
    w 1200
    p b
    c b -dim
    t b | Backup numbers
    say | Tap the eye to put it back on the slides.
    w 1500`,
  "1.219.0#513": `
    cap | Feedback from any help topic
    say | Open help on any page.
    + pg col
    + t ln > pg | Journal
    + d ln > pg | Missing something, or broken?
    + c chip > pg | Suggest a feature   Report a bug
    w 1200
    say | Suggest a feature or report a bug at the foot.
    p c
    w 1500`,
  "1.218.0#373": `
    cap | Paste a reply anywhere
    say | Paste their reply on any line.
    + pg col
    + t ln > pg | 1 done · 2: delivered by Friday
    w 900
    say | A note names the tasks and what would change.
    + c chip > pg | Update from Lars: Done · Due Fri · note added   Apply | Keep as text
    w 1200
    p c
    say | Apply makes the changes. Undo takes them back.
    w 1500`,
  "1.217.0#458": `
    cap | Bring your notes from another app
    say | Start your own, and the first Journal asks.
    + pg col
    + t ln > pg | Coming from another app?
    + c chip > pg | Obsidian · Dynalist · Logseq · WorkFlowy
    w 1200
    say | Pick your app for its steps and the importer.
    p c
    + d ln > pg | Download the importer
    w 1500`,
  "1.216.0#484": `
    cap | Learn Present by presenting
    say | Present's help is four short topics now.
    + pg col
    + t ln > pg | Present a page · Layouts · Notes · Presenter
    w 900
    say | Open the Present tutorial makes a page to present.
    + c chip > pg | Open the Present tutorial
    w 1200
    p c
    + u ln > pg | (pyramid) What makes a regular
    w 1500`,
  "1.215.0#492": `
    cap | Go on where you left off
    say | The Journal opens as always.
    + pg col
    + t ln > pg | Journal · Mon 23 Nov
    w 900
    say | On top: Continue, from any of your devices.
    + c chip > pg | ▸ Continue: Kitchen renovation (Windows, 14:02)
    w 1200
    p c
    w 1500`
};
