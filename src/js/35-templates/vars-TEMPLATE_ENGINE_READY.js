/* Templates own defaults and event rules; existing files are never replaced. */
let TEMPLATE_ENGINE_READY = false, TEMPLATE_COPYING = false;
const TEMPLATE_DEFAULTS = {
  "1": {props: {title:"%title%",status:"%status%",outcome:"",created:"%today%",reviewed:"%today%"}, lines:[
    "@on status=DOING -> started=%today%", "@on status=DONE -> completed=%today%",
    "@on status!=DONE -> completed=%empty% ; overwrite", "@on status=CANCELLED -> cancelled=%today%",
    "@on status=WAIT -> waiting_since=%today%", "@on review -> reviewed=%today% ; overwrite"]},
  "todo": {props:{Added:"[[%today%]]",by:"%user%",started:"",CLOSED:"",done_by:"",feature_repeat_prompt:"true",feature_completion_prompt:"true"},lines:[
    "@on status=DOING -> started=%today%", "@on status=DONE -> CLOSED=[[%today%]]",
    "@on status=CANCELLED -> CLOSED=[[%today%]]", "@on status=DONE -> done_by=%user% %now%",
    "@on status=TODO -> CLOSED=%empty% ; overwrite", "@on status=TODO -> done_by=%empty% ; overwrite",
    "@on status=DOING -> CLOSED=%empty% ; overwrite", "@on status=DOING -> done_by=%empty% ; overwrite"]},
  "journals": {props:{title:"%date%",created:"[[%date%]]"}},
  "page": {props:{title:"%title%",created:"%today%"}},
  "p": {props:{title:"%title%",type:"person",birthday:"",email:"",phone:"",created:"%today%"}},
  "o": {props:{title:"%title%",type:"org",created:"%today%"}},
  "c": {props:{title:"%title%",type:"context",created:"%today%"}},
  "z": {props:{title:"%title%",created:"%today%"},lines:["%title%","Relates to","Contradicts","Informs"]},
  "m": {props:{title:"%title%",type:"email",created:"%today%"}},
  // medium:: book, film, series or video -- one kind of page for all of them
  "r": {props:{title:"%title%",type:"review",medium:"",by:"",rating:"",created:"%today%"}},
  "a": {props:{title:"%title%",type:"area",created:"%today%"},lines:["What does keeping this responsibility healthy look like?"]},
  "g": {props:{title:"%title%",type:"goal",horizon:"3",created:"%today%"},lines:["What has to be true for this to count as achieved?"]},
  "k": {props:{title:"%title%",type:"checklist",created:"%today%"},lines:["First step"]}
};
