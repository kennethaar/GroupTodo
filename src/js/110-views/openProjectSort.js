function openProjectSort(sort) {
  modal({title: "Sort projects", body: choiceGroup("Order", sort.opts, sort.sort, v => { sort.set(v); closeModal(); })});
}
