/* slides.css in an area's 8/ styles that area's slides only (#431). It is
   kept out of the app's own look and laid over the slides instead. */
function isSlidesCssPath(p) { return isVaultCssPath(p) && /(^|\/)slides\.css$/i.test(p); }
