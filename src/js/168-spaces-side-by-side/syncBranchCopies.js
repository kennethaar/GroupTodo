function syncBranchCopies(path) {
  if (BRANCH_SYNC_BUSY) return;
  BRANCH_SYNC_BUSY = true;
  try {
    walkBlocks(getPage(path)?.blocks || [], source => {
      const id = source.props?.branch_sync_id;
      if (!id) return;
      for (const [space, rec] of LOADED) {
        for (const [otherPath, other] of rec.pages) {
          if (space === V.space && otherPath === path) continue;
          walkBlocks(other.blocks, b => {
            if (b.props?.branch_sync_id !== id) return;
            Object.assign(b, cloneBlock(source), {id: b.id});
            rec.dirty.add(otherPath);
            return false;
          });
        }
      }
    });
  } finally { BRANCH_SYNC_BUSY = false; }
}
