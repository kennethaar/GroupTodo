/* Enter on the middle: a new step under the thing you are looking at. It asks
   for words rather than dropping a blank row in, because a nameless line in
   somebody's plan is litter, and because the same box is what every other way
   of adding a todo here uses. */
function addChildTodo(path, block, space) {
  promptInput({
    title: "A step under this one",
    label: linkWords(block.title) || "This todo",
    cta: "Add",
    onSave: text => inSpace(space, () => {
      const kid = stampAuthor(newBlock({state: "TODO", title: text,
                                        props: {}}));
      createLinkedPages(kid.title);
      (block.children || (block.children = [])).push(kid);
      touch(path); noteTodoTouched();
      render();
      openTaskDetail(path, kid, space);
    }),
  });
}
