/* A face if there is one, initials in their own colour if not. */
function avatarNode(name, size) {
  const px = size || 26;
  const src = avatarOf(name);
  const common = {class: "avatar", style: "width:" + px + "px;height:" + px + "px"};
  if (src) return el("img", Object.assign({src, alt: name || "", loading: "lazy"}, common));
  return el("div", Object.assign({}, common, {
    style: common.style + ";background:" + personTint(name) +
           ";font-size:" + Math.round(px * 0.40) + "px",
  }), initialsOf(name));
}
