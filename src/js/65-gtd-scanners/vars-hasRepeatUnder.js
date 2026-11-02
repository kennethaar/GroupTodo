const hasRepeatUnder = blocks => flattenBlocks(blocks || []).some(b => OPEN_STATES[b.state] && repeatOf(b));
