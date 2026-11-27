/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_ANIM = {
  "1.230.0#516": `
    cap | Catch up with an AI: a short review after
    say | Apply puts the AI's new lines on today's page.
    # One spotlight from the first callout to the end: it moves from part to
    # part, never back to everything. A part first, to read it, then its words,
    # 1.5 s + 0.3 s a word (callout and part). After a click it moves to the result.
    + pg col
    + h h > pg | Friday 27 November
    + hd ln > pg | ✦ Catch-up from AI · 14:05
    + a ln d1 > pg | Call the printer [[Product A launch]]
    + b ln d1 > pg | Client liked the draft [[Website refresh]]
    + c ln d1 > pg | Renew the parking permit
    w 2500
    o o hd right
    w 1500
    o o hd right | One heading: the AI wrote these
    w 4800
    o o a right
    w 1500
    o o a right | Linked to its project
    w 4500
    say | Then Quick asks about each line: something to do, or a note?
    o o a right
    c a +lit
    + ai chip acc > a | ✦ Written by AI
    + r row > pg
    + n btn > r | ✎ Just a note
    + t btn pri > r | ⚡ Something to do
    w 1500
    o o ai below | Says who wrote it
    w 3900
    o o t+a right
    w 1000
    o o t+a right | Makes this line a to-do
    w 5000
    p t
    - ai
    c a -lit +task
    o o a right
    w 1200
    c b +lit
    o o n+b right
    w 1000
    o o n+b right | Keeps this line as a note
    w 5000
    p n
    c b -lit
    o o b right
    w 1200
    c c +lit
    o o t+c right
    w 1200
    p t
    c c -lit +task
    o o c right
    w 1200
    say | Then each to-do gets only what it still lacks, such as a context.
    - r
    c c +lit
    + q col > pg
    + qq quiet > q | Where, or with what, can you do it?
    + r2 row > q
    + x chip ctx > r2 | @Phone
    + y chip ctx > r2 | @Errands
    o o q right
    w 1500
    o o q right | Only what is missing is asked
    w 4500
    p y
    + cc chip ctx > c | @Errands
    c c -lit
    o o c right
    w 1500
    say | It ends with what became of them.
    - q
    + s card > pg | 3 lines sorted: 2 to-dos, 1 note
    o o s above
    w 1500
    o o s above | A summary of what you sorted
    w 5100`,
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
    w 1500`
};
