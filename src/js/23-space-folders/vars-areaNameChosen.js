/* The area's name, written into its folder's settings so that everybody who
   opens the folder -- by invite or by simply pointing at it -- calls it the
   same thing. Written only when somebody chose the name: "Personal" is what
   the app calls an area nobody has named, and writing it into a shared
   folder would hand that guess to everyone. Never overwrites a name the
   folder already carries. */
const areaNameChosen = sp => !!sp && !sp.nameLocal &&
  (sp.named || (!sp.placeholder && !sp.nameFrom && sp.name !== "Personal"));
