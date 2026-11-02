function relProps(r) { return r.block ? (r.block.props || (r.block.props = {})) : getPage(r.path).props; }
