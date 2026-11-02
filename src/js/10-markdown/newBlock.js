function newBlock(patch = {}, applyDefaults = true) {
  const block=Object.assign({id:uid(),state:null,title:"",props:{},body:[],children:[],collapsed:false},patch);
  if (applyDefaults && typeof TEMPLATE_ENGINE_READY !== "undefined" && TEMPLATE_ENGINE_READY && block.state) applyTodoTemplate(block);
  return block;
}
