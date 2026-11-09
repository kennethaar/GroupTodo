/* ---------- Let AI write it (#344) ----------
   Your notes on a task are written for you: "what is the status of this",
   the names of the people you meant to ask, the whole background. The person
   you ask has seen none of it. An AI is good at turning the one into the
   other, the way it turns a project's ideas into a plan. As there, the app
   never talks to the AI: the prompt is copied, you paste it into your own,
   and paste its answer back. Only what you see in the prompt leaves. */
const ASK_PROMPT_PATH = join(PROMPT_DIR, "Update questions.md");
const ASK_PROMPT_DEFAULT = `I am asking {person} for an update by email. {person} has not seen my notes or the project pages below. Read the project pages for background: the lines marked <- item N are what the items are about. Then, for each numbered item, write in {language}:

Question: one specific question {person} can answer in one sentence. Ask for a date, a yes or no, or a name where that fits. Never just "what is the status".
Summary: one short line, so {person} recognises what it is about. Leave out my internal notes.
Why: one short line on why it matters now. Leave it out if the notes do not say.

If an item is about the same thing as an earlier one, write only "Same as: <its number>".
Keep the labels Question:, Summary:, Why: and Same as: in English and the numbers as they are. Nothing else.

{items}`;
// The language the AI writes in: the language of the note it goes into.
// A project page's bookkeeping, left out of the prompt (askPageForAi).
const ASK_PAGE_SKIP = /^(id|added|by|started|closed|done_by|created|updated|modified|asked|acknowledged|msg|at|handled|decided|flagged_by|template_hidden|base|order|color|icon)$/i;
const ASK_AI_LANG = {en: "English", sv: "Swedish", no: "Norwegian", da: "Danish", de: "German"};
