/* The slot the count lives in. Always there, usually empty: that way the count
   can appear and go without the board being rebuilt around it. */
const boardSelHost = () => el("div", {id: "bselHost"}, boardSelBar());
