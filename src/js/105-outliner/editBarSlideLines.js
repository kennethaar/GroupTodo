/* The lines a Slide layout pick marks (#433): a line's own lines, so a pick
   on a slide's title marks its items; a line with none is marked itself. */
const editBarSlideLines = b => (b.children || []).length ? b.children : [b];
