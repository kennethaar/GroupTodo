/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
  "1.204.0#523": `
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
  "1.201.6#474": `
    cap | A link opens its page first
    say | A link opens GroupToDo on a phone.
    w 1200
    # The linked page is read alone and drawn first; today's page follows.
    + pg col abs
    s pg | left:12px;top:12px;right:12px
    + h h > pg | Opening Kontantoppgjør…
    + m ln > pg |
    + q quiet > pg | 0.0 s
    w 500
    say | Only the linked page is read.
    t q | 1.5 s
    w 500
    t q | 2.9 s
    say | It is on screen in about 3 seconds.
    t h | Kontantoppgjør
    t m | Check the receipts
    c m +lit
    w 700
    say | The rest comes in behind it.
    t q | Today's page and projects come in behind
    w 1500`,
  "1.201.5#474": `
    cap | A link opens in seconds
    say | A big folder takes minutes to read on a phone.
    w 1200
    # The linked page opens in seconds; the rest of the folder comes in behind it.
    + pg col abs
    s pg | left:12px;top:12px;right:12px
    + h h > pg | Opening Kitchen renovation…
    + m ln > pg |
    + q quiet > pg | Folder: 12 of 1203 files
    w 700
    say | The linked page opens as soon as it is read.
    t h | Kitchen renovation
    t m | Measure the window
    c m +lit
    w 600
    say | The rest of the folder keeps coming in.
    t q | Folder: 400 of 1203 files
    w 700
    t q | Folder: 1203 of 1203 files
    w 1300`,
  "1.201.4#474": `
    cap | Where a link goes, while it opens
    say | You tap a link to a line in a chat.
    w 1200
    # The new tab says where the link goes until the page is in.
    + pg col abs
    s pg | left:12px;top:12px;right:12px
    + h h > pg | Chat · Anna
    + m ln > pg | Here it is → grouptodo.html#gt…
    w 800
    p m
    say | The new tab says where it goes.
    t m | Opening Kitchen renovation at “Measure the window”…
    c m +dim
    w 900
    c m -dim
    say | Then the page opens at the line.
    t h | Kitchen renovation
    t m | Measure the window
    c m +lit
    w 1500`,
  "1.201.3#474": `
    cap | A link opens at its line
    say | You tap a link to a line in a chat.
    w 1200
    # A link tapped in a chat opens the app in a new tab, at the line.
    + pg col abs
    s pg | left:12px;top:12px;right:12px
    + h h > pg | Chat · Anna
    + m ln > pg | Here it is → grouptodo.html#gt…
    w 800
    p m
    say | GroupToDo opens in a new tab.
    t m | Opening area...
    c m +dim
    w 900
    c m -dim
    say | It waits for the page, then opens it at the line.
    t h | Kitchen renovation
    t m | Measure the window
    c m +lit
    w 1500`,
  "1.200.2#433": `
    cap | A hub slide
    say | A slide can put a project in the middle.
    w 1200
    + sl slide
    + h hub > sl | Kitchen renovation
    s h | left:40%;top:28%;width:78px;height:78px
    say | Its parts sit around it.
    + a spoke > sl | Tiles
    s a | left:6%;top:14%
    + b spoke > sl | Plumber
    s b | left:6%;top:72%
    + c spoke > sl | Budget
    s c | left:74%;top:14%
    w 800
    c a +glow
    say | Each part shows its next step in turn.
    + cd scard fade > sl | Choose tiles · Ask Anna
    s cd | left:64%;top:66%
    w 50
    c cd -fade
    w 1500
    c a -glow
    c b +glow
    t cd | Book the plumber · Fri
    w 1500`,
  "1.200.1#431": `
    cap | Present a page
    say | Any page can become slides.
    w 1200
    + sl slide
    say | The title comes first.
    + t big > sl | Kitchen renovation
    w 1200
    s t | transform:translateY(-60px) scale(.6)
    w 650
    c t +fade
    say | Then each heading and its lines.
    + n h fade > sl | Why now
    + l ln fade > sl | The tap leaks under the sink
    w 50
    c n -fade
    w 300
    c l -fade
    w 1500`,
};
