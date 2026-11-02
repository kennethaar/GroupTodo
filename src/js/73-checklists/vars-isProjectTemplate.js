/* A checklist marked kind:: project is a PROJECT TEMPLATE: running it spins up
   a whole new project with these steps as its actions. "Onboard new insurance
   customer" run twice gives two independent projects, each with the same
   choreography. %name% in a step or in the outcome is replaced by the name you
   give that run. */
const isProjectTemplate = path => trim(getPage(path)?.props?.kind || "") === "project";
