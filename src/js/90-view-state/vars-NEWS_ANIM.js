/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
  "1.201.4#474": `
    # The new tab says where the link goes until the page is in.
    + pg col abs
    s pg | left:12px;top:12px;right:12px
    + h h > pg | Chat · Anna
    + m ln > pg | Here it is → grouptodo.html#gt…
    w 800
    p m
    t m | Opening Kitchen renovation at “Measure the window”…
    c m +dim
    w 900
    c m -dim
    t h | Kitchen renovation
    t m | Measure the window
    c m +lit
    w 1500`,
  "1.201.3#474": `
    # A link tapped in a chat opens the app in a new tab, at the line.
    + pg col abs
    s pg | left:12px;top:12px;right:12px
    + h h > pg | Chat · Anna
    + m ln > pg | Here it is → grouptodo.html#gt…
    w 800
    p m
    t m | Opening area...
    c m +dim
    w 900
    c m -dim
    t h | Kitchen renovation
    t m | Measure the window
    c m +lit
    w 1500`,
  "1.200.2#433": `
    + sl slide
    + h hub > sl | Kitchen renovation
    s h | left:40%;top:28%;width:78px;height:78px
    + a spoke > sl | Tiles
    s a | left:6%;top:14%
    + b spoke > sl | Plumber
    s b | left:6%;top:72%
    + c spoke > sl | Budget
    s c | left:74%;top:14%
    w 800
    c a +glow
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
    + sl slide
    + t big > sl | Kitchen renovation
    w 1200
    s t | transform:translateY(-60px) scale(.6)
    w 650
    c t +fade
    + n h fade > sl | Why now
    + l ln fade > sl | The tap leaks under the sink
    w 50
    c n -fade
    w 300
    c l -fade
    w 1500`,
  "1.200.0#455": `
    + a ln task
    ty a | Anna: send the budget
    w 300
    t a | ~Anna~: send the budget
    w 600
    p a
    + m menu
    s m | left:34px;top:38px
    + m1 item > m | Add wait and link Anna
    + m2 item > m | Link Anna
    w 500
    c m1 +on
    p m1
    - m
    t a | [[Anna]]: send the budget
    + w1 chip wait > a | Waiting for Anna
    w 1600`,
  "1.199.1#469": `
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
    p r1
    c r1 +field
    c bar -gone
    w 50
    c bar -fade
    ty r1 |  tiles
    w 1500`,
  "1.199.0#469": `
    + q quiet | Copied from Excel: Item ⇥ Cost ⇥ Who …
    + a ln caret
    w 700
    k Ctrl+V
    w 400
    k
    - a
    + tb tbl
    + 1 td th > tb | Item
    + 2 td th > tb | Cost
    + 3 td th > tb | Who
    + 4 td > tb | Tiles
    + 5 td > tb | € 900
    + 6 td > tb | Anna
    w 1200
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
    p s3
    c s3 +done
    + b btn pri > mn | Mark review done
    w 400
    p b
    c b +gone
    t h | Review done
    + q quiet > mn | Weekly review leaves the sidebar until it is due.
    w 1000
    p n1
    c n1 +lit
    c n4 -lit +out
    w 1500`,
  "1.198.1#450": `
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
    + q quiet > mn | A week later …
    w 700
    + n4 nav fade > sd | Weekly review
    w 50
    c n4 -fade
    + bd badge > n4 | due
    w 1800`,
  "1.198.0": `
    + h h | Lines inside lines
    + a ln
    ty a | Kitchen renovation
    + c1 chip acc > a | Project
    + b ln task
    k Tab
    c b +d1
    ty b | Choose tiles
    + c ln task d1
    c c -d1 +d2
    ty c | Ask Anna for the catalog
    k
    + i chip > c | ↳ Kitchen renovation
    w 600
    c c +lit
    + nx chip pri > c | Next
    w 1700`,
  "1.197.3": `
    + w1 win abs
    s w1 | left:10px;top:10px;width:46%;height:168px
    + b1 bar > w1 | Edge · Home folder
    + p1 col > w1
    s p1 | padding:8px
    + x1 h > p1 | Welcome
    + s1 btn pri > p1 | Start
    w 500
    p s1
    c s1 +gone
    t x1 | Today
    + l1 ln task > p1 | Book the plumber
    w 800
    + w2 win abs fade
    s w2 | right:10px;top:10px;width:46%;height:168px
    + b2 bar > w2 | Chrome · same folder
    + p2 col > w2
    s p2 | padding:8px
    w 50
    c w2 -fade
    w 600
    + x2 h > p2 | Today
    + l2 ln task > p2 | Book the plumber
    + q quiet > p2 | No welcome again
    w 1700`,
  "1.197.2#431": `
    + o col abs
    s o | left:10px;top:12px;width:44%
    + o0 h lit > o | Kitchen renovation
    + o1 ln > o | Why now
    + o2 ln d1 > o | The tap leaks
    + o3 ln > o | Budget
    + sl slide
    s sl | inset:14px 10px 14px 52%
    + st big > sl | Kitchen renovation
    w 1100
    k →
    c o0 -lit
    c o1 +lit
    t st | Why now
    c st -big +h
    + sb ln dim > sl | The tap leaks
    w 1000
    k →
    c o2 +lit
    c sb -dim +glow
    w 1000
    k →
    c o1 -lit
    c o2 -lit
    c o3 +lit
    - sb
    t st | Budget
    c st -h +big
    k
    w 1400`,
  "1.197.1#466": `
    + w win
    + b bar > w | Presenter window · Now
    + c col > w
    s c | padding:8px
    + l1 ln dim > c | Why now
    + l2 ln lit > c | The tap leaks under the
    + l3 ln > c | Budget
    w 700
    p l2
    p l2
    c l2 +field
    ty l2 |  sink
    k Enter
    c l2 -field
    w 300
    k
    w 1500`,
  "1.197.0#466": `
    + sl slide
    + t h > sl | Budget
    + a ln > sl | Tiles € 900
    + b ln > sl | Plumber € 40
    w 900
    p b
    p b
    c b +field
    s b | color:var(--fg)
    ty b | 0
    k Enter
    w 300
    c b -field
    s b | color:inherit
    k
    w 1500`,
  "1.196.0#465": `
    + bt btn abs | ▶ Present
    s bt | right:14px;top:12px
    + a h | Kitchen renovation
    + b ln | Why now
    + c ln | Budget
    w 700
    p bt
    + pk menu
    s pk | right:14px;top:40px;width:200px
    + ps > pk | Budget
    s ps | background:#16181d;color:#f2f2ef;height:44px;display:grid;place-items:center;border-radius:5px;margin-bottom:4px;font-weight:700
    + i1 item on > pk | Last time
    + i2 item > pk | From the top
    + i3 item > pk | This line, in the whole talk
    w 1200
    k ↓
    c i1 -on
    c i2 +on
    t ps | Kitchen renovation
    w 1000
    k
    p i2
    - pk
    + f slide
    + ft big > f | Kitchen renovation
    w 1500`,
  "1.196.0#462": `
    + h h | Review actions · Kitchen renovation
    + cd card
    + q > cd | Does it wait for another step?
    + s ln task lit > cd | Choose tiles
    + r row > cd
    + y btn > r | Yes, it waits
    + n btn > r | No, it can start
    + al btn > r | They can all go at once
    w 900
    p y
    c y +on
    w 300
    c y -on
    t s | Book the plumber
    w 700
    p n
    c n +on
    w 300
    + dn quiet > cd | Next: Book the plumber. Choose tiles waits.
    w 1500`,
  "1.196.0#411": `
    + a ln | Call Bo about tiles
    + b ln | Order grout
    + c ln | Book the plumber
    w 600
    p a
    c a +sel
    w 250
    c b +sel
    w 250
    c c +sel
    w 400
    k Alt+T
    c a +task
    c b +task
    c c +task
    w 900
    c a -sel
    c b -sel
    c c -sel
    k
    w 1400`,
  "1.196.0#413": `
    + sd side
    + n1 nav > sd | Journal
    + n2 nav > sd | Next
    + mn main
    + a ln > mn | Kitchen renovation
    + b ln lit > mn | Order grout
    + hb btn abs > mn | ☰
    s hb | right:0;top:24px
    w 600
    p hb
    + m menu > mn
    s m | left:-90px;top:52px;opacity:.5
    + m1 item > m | Make it a to-do
    + m2 item > m | Hide in Present
    + m3 item > m | Move to …
    w 300
    s m | left:30px;opacity:1
    w 1800`,
  "1.192.0#460": `
    + cd card abs
    s cd | left:10px;top:12px;width:38%
    + q h > cd | What is it?
    + bt btn > cd | To do
    + bp btn > cd | Project
    + bn btn > cd | Leave it as a note
    + pg col abs
    s pg | left:48%;top:12px;right:10px
    + ph quiet > pg | Sunday
    + l1 ln > pg | Kitchen renovation
    + l2 ln > pg | Choose tiles
    + l3 ln > pg | Book the plumber
    w 600
    p l1
    c l1 +sel
    w 250
    c l2 +sel
    w 250
    c l3 +sel
    w 300
    p bp
    c bp +on
    c l1 -sel
    c l2 -sel +task +d1
    c l3 -sel +task +d1
    + pc chip acc > l1 | Project
    w 1600`,
  "1.191.5#376": `
    + cd card abs
    s cd | left:10px;top:12px;width:38%
    + q h > cd | Clarify
    + t > cd | Ask Anna for the catalog
    + pg col abs
    s pg | left:48%;top:12px;right:10px
    + ph quiet > pg | Sunday
    + f ln fold > pg | Kitchen renovation
    + g ln > pg | Call Bo
    w 1000
    c f -fold +open
    + u1 ln d1 > pg | Choose tiles
    + u2 ln d1 lit > pg | Ask Anna for the catalog
    s g | order:9
    s pg | display:flex;flex-direction:column
    w 1700`,
};
