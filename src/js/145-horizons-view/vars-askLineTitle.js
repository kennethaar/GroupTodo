const askLineTitle = (item, recipient) => {
  if (!recipient) return plainTitle(item.title);
  if (!item.q) return checkinTaskTitle(item.title, recipient);
  const {subject, ask} = askQuestionParts(item, recipient);
  return subject || ask;
};
/* Each line is a numbered block of its own, everything in it indented under
   the number: what it is about, the question, the lines under it, the place
   for the answer, and the reference. A blank line between blocks, so it is
   plain where one ends, and room above the reference to write in. A question
   has no box: it is answered or it is not, so it gets Answer: where a task
   gets a box and Comment:. Each block says what it is about in full, so the
   answer to it stands on its own. */
const ASK_IND = "   ";
