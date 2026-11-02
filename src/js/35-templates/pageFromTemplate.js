function pageFromTemplate(name,title,vars={}) {
  const path=requireTemplate(name);
  return path ? instantiateTemplate(path,{title,created:todayStamp(),reviewed:todayStamp(),...vars}) : {props:{},blocks:[]};
}
