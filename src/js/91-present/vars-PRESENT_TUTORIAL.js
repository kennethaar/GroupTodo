/* The Present tutorial (#484): a page you learn Present on by presenting it.
   Each top line is one slide that shows one thing; the plain lines under it
   are its speaker notes, and say how that slide is written. It is made as a
   normal page, to copy from or keep as a template. */
const PRESENT_TUTORIAL_TITLE = "Present tutorial";
const PRESENT_TUTORIAL = `- Welcome to Present
  These plain lines under a bullet are your notes. Only you see them, in the presenter window.
  Each top line of the page is a slide. Its lines come in one at a time: press → or Space.
  P opens the presenter window. Esc leaves. Double-click a line on a slide to fix it.
  - Each top line is a slide
  - Its lines come one by one
  - Plain lines under a bullet are notes
  - _ A line that starts with _ stays off the slides
- (steps) A morning at the bakery
  Written as (steps) in front of the line. Type ( at the start of a line to pick a layout.
  - Mix the dough
  - Let it rise
  - Bake the bread
  - Open the doors
- (timeline) Our first year
  (timeline): each line is a point in time, in order.
  - Jan: sign the lease
  - Mar: build the kitchen
  - May: open the doors
  - Sep: first big order
- (cycle) How the recipes get better
  (cycle): the lines go round. Write three or more.
  - Bake
  - Sell
  - Ask what people think
  - Change the recipe
- (pyramid) What makes a regular
  (pyramid): the first line is the base, the last is the top.
  - Good bread
  - Kind service
  - A reason to come back
- (hub) The shop
  (hub): the line is in the middle, its lines go round it.
  - Bread
  - Coffee
  - Cakes
  - Orders for parties
- (versus) Night or dawn
  (versus): two lines side by side. The lines under each go in its box.
  - Bake at night
    - Fresh when we open
    - Long shifts
  - Bake at dawn
    - Shorter days
    - Less on the shelf at eight
- (2x2) Where to spend the day
  (2x2): four lines make four boxes.
  - Quick and worth it: do now
  - Slow and worth it: plan it
  - Quick, worth little: hand it off
  - Slow, worth little: drop it
- (scorecard) This month
  (scorecard): one to four lines with an amount or a percent. They show big, side by side.
  - Sales $12k
  - Regulars 40%
  - Waste 6%
- (bar) Loaves a day
  (bar): lines that end in a number become bars. With no word they are a line chart; (pie) makes a pie.
  - Mon 120
  - Tue 95
  - Wed 110
  - Thu 130
  - Fri 180
- (pie) Where sales come from
  (pie): each line is a slice. Each → adds one, with its number on it.
  - Bread 50
  - Coffee 30
  - Cakes 20
- Prices by size
  A table under a line is a slide of its own. Its header shows first, then → adds a row.
  Paste a table from a sheet, and it is written as a Markdown table.
  - | Size | Price |
    | --- | --- |
    | Small | $3 |
    | Large | $5 |
- (quote) What a customer said
  (quote): one line, big, and who said it after --. The lines under it are the takeaways.
  - "The best bread on the street." -- A regular
    - Keep the recipe
    - Put it on the sign
- A picture on a slide
  Drop a picture on a line, then Use as slide picture. It goes in the line's notepad, and the slide shows it.
  A bullet with a picture of its own shows it while it is lit.
- Slides with AI
  ☰ › Copy for AI › Slides copies a prompt. Paste it in your AI with your text, then paste the answer back here.
  Put pictures for it in the area's assets/slides folder, named by what they show.
- That is all
  This page is yours. Copy from it, or keep it as a template.
`;
