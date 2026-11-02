/* Asking at lunch and after work whether you have moved is for people who
   work by context all day. For everybody else it is two toasts a day about
   nothing, so it is off until you turn it on. */
const contextPromptsOn = () => PREF.get("context.prompts", "") === "1";
