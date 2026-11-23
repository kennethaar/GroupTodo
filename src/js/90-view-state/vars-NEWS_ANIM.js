/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
  "1.206.0#482": `
    cap | Numbers on lines become a chart
    say | Lines that end in a number, under a line.
    # Year lines under Visitors; the bullet guesses a line chart, (bar) changes it.
    + pg col
    + l ln > pg | Visitors
    + a ln > pg | 2023 1850
    s a | margin-left:24px
    + b ln > pg | 2024 2600
    s b | margin-left:24px
    w 900
    say | They become a line chart. The faint icon says it is a guess.
    t l | ⌁ Visitors
    + c chip fade > pg | 1850 → 2600, a point per click
    w 50
    c c -fade
    w 1500
    say | Write (bar) or (pie) to change it.
    p l
    t l | (bar) Visitors
    w 900
    t l | ▮ Visitors
    t c | ▮ 1850  ▮ 2600, a bar per click
    w 1800`,
  "1.205.0#481": `
    cap | One word sets how a slide is drawn
    say | Type ( at the start of a line that has lines.
    # "(" opens the layouts, "py" leaves Pyramid, Enter writes it; off the line the bullet is ▲.
    + pg col
    + l ln > pg | (
    + a ln > pg | Purpose
    s a | margin-left:24px
    + b ln > pg | Strategy
    s b | margin-left:24px
    w 700
    + m chip fade > pg | ≡ List · → Steps · ↻ Cycle · ▲ Pyramid · …
    w 50
    c m -fade
    w 900
    say | Letters narrow the list. Enter writes the word.
    ty l | py
    t m | ▲ Pyramid · base to top
    w 900
    k Enter
    t l | (pyramid) What creates value
    c m +fade
    w 700
    k
    say | Off the line, its bullet shows the layout. The slide is a pyramid.
    t l | ▲ What creates value
    w 1800`,
  "1.204.0#480": `
    cap | Join a meeting from its line
    say | A meeting from your calendar keeps its Teams link.
    # A calendar meeting; Join is quiet, then stands out 5 minutes before.
    + pg col
    + m ln > pg | 11:15–12:00  #meeting Harbour Lane kickoff
    + j chip fade > m | ▶ Join
    w 900
    say | Before the meeting, Join shows when you point at the line.
    p m
    c j -fade
    w 1200
    c j +fade
    w 600
    say | From 5 minutes before, Join stands out.
    + k quiet > pg | Now 11:10
    c j -fade
    c j +lit
    w 900
    p j
    say | The reminder has Join too.
    w 1500`,
  "1.203.0#476": `
    cap | A dropped picture can be the slide's picture
    say | You drop a picture on a line.
    # A picture dropped on a line; the note offers to make it the slide's picture.
    + pg col
    + l ln > pg | Kitchen tiles
    w 700
    t l | Kitchen tiles · tiles.png
    + ts chip fade > pg | 1 file saved · Use as slide picture
    w 50
    c ts -fade
    say | The note offers Use as slide picture.
    w 900
    p ts
    t l | Kitchen tiles
    c ts +fade
    + n quiet fade > pg | Notepad: tiles.png, the slide's picture
    w 50
    c n -fade
    say | The picture moves to the line's notepad, for Present.
    w 1500`,
  "1.202.6#431": `
    cap | A title moves up letter by letter
    say | A long title stands big on its own slide.
    # A big title in two lines reflows into one line at the top, piece by piece.
    + sl slide
    + a h abs > sl | Kitchen
    s a | left:8%;top:8%;transform:translate(60px,70px) scale(1.6)
    + b h abs > sl | renovation
    s b | left:30%;top:8%;transform:translate(-20px,105px) scale(1.6)
    + c h abs > sl | plan
    s c | left:62%;top:8%;transform:translate(-50px,140px) scale(1.6)
    w 1200
    say | With the first line it moves up; each piece slides to its new place.
    s a | transform:none
    w 80
    s b | transform:none
    w 80
    s c | transform:none
    w 700
    + l ln fade > sl | Measure the room
    s l | margin-top:48px
    w 50
    c l -fade
    w 1500`,
  "1.202.0#474": `
    cap | Widgets for your phone, one per context
    say | Each context has its own file in Widgets/, for a widget app.
    w 1200
    # Each context has a widget file; a tick there is done in GroupToDo too.
    + pg col abs
    s pg | left:12px;top:12px;right:12px
    + h h > pg | Widgets/@Home.md
    + a ln > pg | ☐ Pay the bill
    + b ln > pg | ☐ Water the plants
    + c ln > pg | ☐ Fix the tap (Kitchen)
    w 900
    say | You tick a line in the widget.
    p b
    t b | ☑ Water the plants
    c b +dim
    w 900
    say | GroupToDo marks it done in its page.
    t h | GroupToDo · @Home
    t b | DONE Water the plants
    c b -dim
    c b +lit
    w 1500`,
};
