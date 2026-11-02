const npmKept = c => (c.keep || []).find(npmOpenLine);
const npmList = (k, label, ask, sub) => ({k, label, ask, sub, done: () => NPM[k].length > 0});
