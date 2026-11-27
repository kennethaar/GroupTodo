/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
  "1.228.0#523": `
    cap | Clarify, Quick: to do or note
    say | Quick shows each loose line in its day, lit up.
    # The day's outline, one line lit; two answers under it.
    + pg col
    + h h > pg | Monday 23 November
    + a ln dim > pg | Supplier meeting with Lars
    + b ln lit d1 > pg | New price list for the cold store
    + c ln dim d2 > pg | They want two quotes
    + r row > pg
    + n btn > r | ✎ Just a note
    + t btn pri > r | ⚡ Something to do
    w 1200
    say | One question: something to do, or just a note?
    p t
    t b | ☐ New price list for the cold store
    c b -lit
    c c +lit -dim
    say | It is a to do now, sorted later. The next line is asked.
    w 1100
    say | Click the words to change them.
    p c
    ty c | , ours and Havbris
    w 1500`,
  "1.227.0#521": `
    cap | Your areas, right in Settings
    say | Settings › Area shows a card per area. No dialogs to open first.
    + pg col
    + h ln > pg | Area
    + a chip > pg | ● Area A   ·   Type: Personal ▾   ·   Change folder · Rename
    + b chip > pg | ● Area B   ·   Type: Work ▾   ·   Change folder · Rename
    w 1500
    say | Each card sets its own area's type.
    p b
    w 1500`,
  "1.226.0#519": `
    cap | Any word can be the verb
    say | Review actions › Verb › All shows the line's own words.
    + pg col
    + q ln > pg | Quarterly report check
    + w ln > pg | A word in the line is the verb:
    + a chip > w | Quarterly
    + b chip > w | report
    + c chip > w | check
    p c
    w 1500
    say | Type a verb the list does not have, and add it.
    + s ln > pg | Search: wrangle
    + n chip > pg | ＋ Add “Wrangle” as a verb
    p n
    w 1800`,
  "1.225.0#518": `
    cap | Clarify on a numpad
    say | Clarify numbers its answers like a numpad, as Review actions does.
    + pg col
    + t ln > pg | 7 To do   ·   8 Someday   ·   9 Done already
    + m ln > pg | 4 Waiting   ·   5 Meeting with Team A   ·   6 A note
    + u ln > pg | 1 Project   ·   2 Idea   ·   3 Note for a responsibility
    w 1500
    say | 5 is the line. 5 again skips it.
    s m | font-weight:700
    w 1500
    say | Notes from a meeting? 0 leaves the line and every line under it as notes.
    + z chip > pg | 0 Leave it and the 12 under it as notes
    p z
    w 1800`,
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
    w 1500`
};
