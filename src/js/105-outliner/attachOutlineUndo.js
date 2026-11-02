function attachOutlineUndo(host,path,block) {
  const edits=[]; let restoring=false, pasting=false;
  const remember=()=>{
    if (restoring) return;
    const text=host.textContent;
    if (edits.length && edits[edits.length-1].text===text) return;
    edits.push({text,props:structuredClone(block.props || {}),state:block.state,title:block.title});
    if (edits.length>150) edits.shift();
  };
  host.addEventListener("beforeinput",e=>{
    if (e.inputType==="historyUndo") { e.preventDefault(); restore(); }
    else if (e.inputType!=="historyRedo") remember();
  });
  const restore=()=>{
    const old=edits.pop();
    if (!old) return false;
    restoring=true;
    block.title=old.title; block.state=old.state; block.props=old.props;
    setHostText(host,old.text,old.text.length); touch(path);
    restoring=false; return true;
  };
  host.addEventListener("keydown",e=>{
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase()==="z") {
      e.preventDefault(); e.stopImmediatePropagation();
      if (!restore()) { host.blur(); undoLast(); }
    }
  },true);
  host.addEventListener("paste",()=>{
    remember();
    pasting = true;
    queueMicrotask(() => {
      pasting = false;
    });
    const page=getPage(path), snapshot=structuredClone(page), space=V.space;
    walkBlocks(snapshot.blocks, b => {
      if (b.id === block.id) {
        const [st, rest] = splitState(host.textContent);
        b.title = st ? rest : host.textContent;
        if (st) b.state = st;
      }
    });
    pushUndo({at:Date.now(),run:()=>{
      if (V.space!==space) return false;
      const current=getPage(path); if (!current) return false;
      Object.assign(current,structuredClone(snapshot)); touch(path); render(); focusBlock(block.id); return true;
    }});
  },true);
  host.addEventListener("focus",()=>{
    const snapshot=structuredClone(getPage(path)),space=V.space;
    const initial=block.title;
    host.addEventListener("blur",()=>{
      if (pasting) return;
      if (host.textContent===initial && block.title===initial) return;
      pushUndo({at:Date.now(),run:()=>{
        if (V.space!==space || !getPage(path)) return false;
        Object.assign(getPage(path),structuredClone(snapshot));touch(path);render();focusBlock(block.id);return true;
      }});
    },{once:true});
  });
}
