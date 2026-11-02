const usageNewPage = () => ({props: {title: "Usage of GroupToDo"}, blocks: [newBlock({title: USAGE_ABOUT}, false)]});
const USAGE_LINE_RE = /^(\d{4}-\d{2}-\d{2}) · (\S+) · (.*)$/;
const usageMin = s => String(Math.round(s / 6) / 10);
