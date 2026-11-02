function reviewListPage() {
  return {
    props: {title: "Weekly review", cadence: "weekly", created: todayStamp()},
    blocks: REVIEW_STEPS.map(([section, steps]) => newBlock({title: section,
      children: steps.map(([title, note]) => newBlock({title, children: [newBlock({title: note})]}))})),
  };
}
