/* What's new animations (#471), one per new thing with something new to see,
   keyed by newsAnimKey (version, and "#issue" when it has one). Each is a
   text script, one step a line, read by newsSteps. Keep only the newest 30: new users never saw the old
   look, so an older one is deleted when a new one comes. */
const NEWS_HOLD = 2500;
const NEWS_ANIM = {
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
    w 1500`,
  "1.214.0#485": `
    cap | Hold Alt for the time and your camera
    say | Hold Alt on a slide: the time shows top-left.
    + pg col
    + t chip > pg | ⏱ 12:34
    + c chip > pg | ◉ Camera off
    w 1200
    say | One click turns your camera on or off.
    p c
    w 1500`,
  "1.213.0#491": `
    cap | A picture as a bullet
    say | A line with only a picture comes in its turn, like any bullet.
    + pg col
    + t ln > pg | About us
    + a ln > pg | ▢ picture
    s a | opacity:.2
    w 1200
    s a | opacity:1
    w 1200
    say | It stays bright when the next line comes.
    + b ln > pg | • Founded in 1946
    w 1500`,
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
};
