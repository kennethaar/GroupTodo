/* The prerequisites of this project that are not finished yet. */
const blockersOf = path => dependsOn(path).filter(p => !projectCleared(p));
