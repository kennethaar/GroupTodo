/* The templates that come with the app (#420). A feature for one kind of work
   is one of these, out of the way until somebody picks it. */
const BUILTIN_TEMPLATES = [
  {name: "Write a book", kind: "Built in",
   blurb: "A book in this area. Chapters go from Outline to Done, and your words are counted every day.",
   parts: [["It adds", ["A Chapter stage list", "Place and Thing templates", "Words on each day"]],
           ["Views", ["Chapters", "Read", "Plot", "Timeline", "Cast", "Relations", "Revise"]]],
   cta: "Make the book", run: () => openBookInfo({create: true})},
];
