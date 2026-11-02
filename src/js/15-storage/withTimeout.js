function withTimeout(promise, ms, what) {
  let timer;
  return Promise.race([promise, new Promise((_, no) => {
    timer = setTimeout(() => no(Object.assign(new Error((what || "a file") + " did not answer in " +
      Math.round(ms / 1000) + " s"), {name: "TimeoutError"})), ms);
  })]).finally(() => clearTimeout(timer));
}
