const npmQ = () => { const qs = npmQs(NPM.step); NPM.q = Math.max(0, Math.min(NPM.q, qs.length - 1)); return qs[NPM.q]; };
