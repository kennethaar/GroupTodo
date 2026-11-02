/* ============================================================
   PLAN IT WITH AN AI
   One line, a handful of picked lines or an email, made into a prompt for an
   AI: turn this into a project with one next action. The app never talks to
   an AI itself. It fills in what the AI cannot know -- who you are, this
   area's contexts, the people and projects already here -- copies it, and
   opens the AI you use in this area, if you said which. The answer is pasted
   back into the same dialog and mended on the way in, because AIs get the
   same things wrong: the whole action wrapped in [[ ]], a context that is not
   one of yours, a person here written without a link.

   Only the projects the text is likely about are named, picked on this
   device by the words and people they share with it, so the AI is not sent
   the list of everything you are working on.
   ============================================================ */
const PLAN_PROMPT_PATH = join(PROMPT_DIR, "GTD project.md");
const PLAN_PROMPT_DEFAULT = `You are a GTD master trainer helping {name}. Turn the text at the bottom into a GTD project plan with exactly ONE next action. "{name}", "I" or "me" in the text is the user; {name} is never a stakeholder. Write in the same language as the text.

{project}

{projects}

{people}

THE MOST IMPORTANT RULE - THE ACTION LINE:
The action is plain text. After "TODO " comes a verb in plain letters, never "[[". The only things in [[ ]] on that line are:
- people, as [[p/First Last]]
- companies, as [[o/Full name]]
- one context, at the very end
The sentence itself is never inside [[ ]].

Answer ONLY with the plan in one code block, nothing before or after it. Keep the headings exactly as written here:

<Project name>

* Stakeholders (Person or customers): <links>
* Purpose(Why & What standards)*: <text>
* Vision(Wild success & all deets done ??)*: <text>
* Decide(Next phys-viz ? w all u need in 1 go):
   * TODO <Verb> <the rest of the action> <context>

How to fill it in:
- Project name: short and outcome-focused, verb first if it helps. Plain text, no [[ ]].
- Stakeholders: everyone involved, informed or affected, except {name}. People as [[p/First Last]], companies as [[o/Full name]], separated by ", ".
- Purpose: why it matters, what drives it, the standards and limits.
- Vision: what complete success looks like, concretely. Use names, numbers and dates from the text. Where the text does not say, write a short guess marked (?) rather than making something up.
- Decide: one physical, visible action that can be done in one sitting, with everything needed for it on the line. If {name} is waiting on somebody, write instead:
   * WAIT for [[p/First Last]] to <specific outcome> <context>
  A due date only if the text gives one, on the line under the action: DEADLINE:: [[YYYY-MM-DD]]
- Context: exactly one of these: {contexts}

A right action line looks like this:
   * TODO Call [[p/Ola Nordmann]] about when the release reaches production <context>

CHECK BEFORE YOU ANSWER: if your action line has "TODO [[" or "WAIT for [[" followed by anything but p/ or o/, rewrite it as plain text where only names and the context are linked.

THE TEXT:
"""
{text}
"""`;

/* Where the prompt goes once it is copied. Copy only is for an AI on this
   computer, or any other: the prompt is on the clipboard either way. */
const PLAN_AIS = [
  ["", "Copy only"],
  ["https://chat.deepseek.com/", "DeepSeek"],
  ["https://chatgpt.com/", "ChatGPT"],
  ["https://claude.ai/new", "Claude"],
  ["https://gemini.google.com/app", "Gemini"],
  ["https://copilot.microsoft.com/", "Copilot"],
  ["https://m365.cloud.microsoft/chat", "Copilot for work"],
  ["https://chat.mistral.ai/chat", "Le Chat (Mistral)"],
  ["https://www.perplexity.ai/", "Perplexity"],
];
const planAiOf = space => PREF.get("plan.ai:" + (space || ""), "");
