/* ---------- a page per tracker ----------
   pages/8/Trackers/coffee.md holds what is set for one tracker, each a
   key:: value so it reads in any editor too:

     icon:: ☕             what a tap adds (tap to count only)
     colour:: orange       its colour in every chart it is in
     chart:: Drinks        a chart it shares with trackers of the same kind
     style:: stacked-bar   how the chart is drawn: line, bar or stacked-bar

   Made the first time it is opened, like the timer's. What is written under
   the values is your own notes. Two units on one chart would need two
   scales, so only trackers of the same letter share one, and a shared chart
   has one style: setting it on one tracker sets it on all of them. */
const trackerGroup = name => trackerList().find(g => g.name === name);
