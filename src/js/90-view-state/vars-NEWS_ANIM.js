/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
  "1.212.0#485": `
    cap | Your camera in the talk
    say | Shift+C puts you on the slides. The slide picks where.
    + pg col
    + t ln > pg | Roadmap 2027
    + v chip > pg | ● You, big behind the title
    w 1500
    say | A plain slide: you in a round bubble in the corner.
    + b chip > pg | ◯ Bubble
    s b | border-radius:999px
    w 1500
    say | The presenter window: Auto, or pick one for this slide.
    + a chip > pg | Auto (Bubble)
    + g chip > pg | Big
    p g
    w 1500`,
  "1.211.0#489": `
    cap | Run the talk from the presenter window
    say | The Next box is a button. ‹ Back is beside it.
    + pg col
    + b chip > pg | ‹ Back
    + n ln > pg | Next › The roof leaks
    s n | border:1px solid currentColor;padding:12px;border-radius:8px
    w 900
    p n
    w 1200
    say | ⏱ Count down… starts the waiting screen from here.
    + t chip > pg | ⏱ Count down…
    p t
    + k ln > pg | Starts at 13:00 · 4:59
    w 1500
    say | Start the talk when you are ready.
    + g chip > pg | Start the talk
    p g
    w 1500`,
  "1.210.0#488": `
    cap | Pins on a map, a card about you
    say | (map) puts the line's picture behind the slide.
    + pg col
    + l ln > pg | (map) About me 🗺
    + c ln > pg | 🖼 Sam Lee · Account manager
    s c | margin-left:24px
    + p ln > pg | 📍 Lisbon
    s p | margin-left:24px
    w 1500
    say | A line that starts with 📍 is a pin. Alt+drag puts it in place.
    + q ln > pg | 📍 Porto
    s q | margin-left:24px
    w 900
    say | Pins in a row: one pin that moves on each click.
    c p +dim
    w 1800`,
  "1.209.0#487": `
    cap | Place a line just so
    say | Hold Alt on a slide: what can move gets an edge.
    + pg col
    + t ln > pg | About us
    + a ln > pg | • Founded 1946
    + r chip > pg | ↺ Reset slide
    s t | outline:1px dashed currentColor
    s a | outline:1px dashed currentColor
    w 1200
    say | Alt+drag it. It snaps to the middle.
    p a
    s a | outline:1px dashed currentColor;margin-left:60px;transition:margin .8s
    w 1500
    say | The place is kept. Reset slide takes it off.
    p r
    s a | margin-left:0;transition:margin .8s
    w 1500`,
  "1.208.0#486": `
    cap | A countdown before the talk starts
    say | ▶ Present ▾ › Count down to the start…
    + pg col
    + s ln > pg | Next course: Lean in practice
    + q chip > pg | ▦ QR: sign up
    w 900
    + b chip fade > pg | Starts at 13:00    12:47
    w 50
    c b -fade
    w 1200
    say | Lines under (waiting) show in turn.
    t s | Coffee is in the hall
    - q
    t b | Starts at 13:00    12:37
    w 1500
    say | → starts the talk when you are ready.
    t b | Starting now
    w 1500`,
  "1.207.0#483": `
    cap | Your AI makes slides of your text
    say | ☰ › Copy for AI › Slides copies a prompt.
    + pg col
    + l ln > pg | Harbour talk: we moved the boats, then learned…
    + m chip fade > pg | Copy for AI › Plan · Slides
    w 50
    c m -fade
    w 900
    p m
    t m | Prompt copied, with 42 pictures. Paste it into your AI.
    w 1500
    say | Paste its answer back: Make the slides.
    - m
    + a ln > pg | ↻ How we work
    s a | margin-left:24px
    + b ln > pg | ▲ What creates value
    s b | margin-left:24px
    w 900
    say | Pictures come from assets/slides, picked by name.
    + c chip fade > pg | 🖼 Harbour 2.jpg
    s c | margin-left:48px
    w 50
    c c -fade
    w 1800`,
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
};
