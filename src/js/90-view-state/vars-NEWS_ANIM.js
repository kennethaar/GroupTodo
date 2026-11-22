/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
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
  "1.200.0#455": `
    cap | A name and a colon: waiting for
    say | You start a line with a person's name and a colon.
    w 1200
    + a ln task
    ty a | Anna: send the budget
    w 300
    t a | ~Anna~: send the budget
    w 600
    say | The name gets a wavy line. Tap it.
    p a
    + m menu
    s m | left:34px;top:38px
    + m1 item > m | Add wait and link Anna
    + m2 item > m | Link Anna
    w 500
    c m1 +on
    say | Add wait and link Anna.
    p m1
    - m
    t a | [[Anna]]: send the budget
    say | The line now waits for Anna.
    + w1 chip wait > a | Waiting for Anna
    w 1600`,
  "1.199.1#469": `
    cap | Tables you can edit
    say | A table has a bar while you write in it.
    w 1200
    + tb tbl
    + h1 td th > tb | Item
    + h2 td th > tb | Cost
    + h3 td th > tb | Who
    + bar bar gone fade > tb | Row ＋  Column ＋  ⇤ ⇥  Reveal Rows | Columns
    s bar | grid-column:1/-1
    + r1 td > tb | Floor
    + r2 td > tb | € 900
    + r3 td > tb | Anna
    + r4 td > tb | Plumber
    + r5 td > tb | € 400
    + r6 td > tb | Bo
    w 700
    say | Tap a cell and type.
    p r1
    c r1 +field
    c bar -gone
    w 50
    c bar -fade
    ty r1 |  tiles
    w 1500`,
  "1.199.0#469": `
    cap | Paste a table
    say | You copy a table from Excel.
    w 1200
    + q quiet | Copied from Excel: Item ⇥ Cost ⇥ Who …
    + a ln caret
    w 700
    say | Paste it on a line.
    k Ctrl+V
    w 400
    k
    - a
    say | It becomes a Markdown table.
    + tb tbl
    + 1 td th > tb | Item
    + 2 td th > tb | Cost
    + 3 td th > tb | Who
    + 4 td > tb | Tiles
    + 5 td > tb | € 900
    + 6 td > tb | Anna
    w 1200
    say | In Present, it shows row by row.
    + sl slide fade
    + st tbl > sl
    + 7 td th > st | Item
    + 8 td th > st | Cost
    + 9 td th > st | Who
    w 50
    c sl -fade
    w 800
    k →
    + 10 td > st | Tiles
    + 11 td > st | € 900
    + 12 td > st | Anna
    w 600
    k →
    + 13 td > st | Plumber
    + 14 td > st | € 400
    + 15 td > st | Bo
    k
    w 1400`,
  "1.198.2#450": `
    cap | Weekly review in the sidebar
    say | Weekly review sits in the sidebar while it is due.
    w 1200
    + sd side
    + n1 nav > sd | Journal
    + n2 nav > sd | Next
    + n3 nav > sd | Projects
    + n4 nav lit > sd | Weekly review
    + mn main
    + h h > mn | Weekly review
    + s1 ln task done > mn | Clarify
    + s2 ln task done > mn | Review actions
    + s3 ln task > mn | Look ahead
    w 800
    say | You work through its steps.
    p s3
    c s3 +done
    + b btn pri > mn | Mark review done
    w 400
    say | Then mark the review done.
    p b
    c b +gone
    t h | Review done
    say | It leaves the sidebar until next time.
    + q quiet > mn | Weekly review leaves the sidebar until it is due.
    w 1000
    p n1
    c n1 +lit
    c n4 -lit +out
    w 1500`,
  "1.198.1#450": `
    cap | Weekly review when it is due
    say | Weekly review is part of Projects.
    w 1200
    + sd side
    + n1 nav > sd | Journal
    + n2 nav > sd | Next
    + n3 nav lit > sd | Projects
    + mn main
    + h h > mn | Projects
    + sw row > mn
    + b1 btn on > sw | Active
    + b2 btn > sw | Someday
    + b3 btn > sw | Weekly review
    w 1200
    say | A week passes.
    + q quiet > mn | A week later …
    w 700
    say | It shows in the sidebar, marked due.
    + n4 nav fade > sd | Weekly review
    w 50
    c n4 -fade
    + bd badge > n4 | due
    w 1800`,
};
