function scheduleContextPrompts() {
  for (const [h, m, label] of CFG.contextPrompts) {
    const tick = () => {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      let delay = target - now;
      if (delay <= 0) delay += 86400000;
      setTimeout(() => {
        if (contextPromptsOn()) offerContextChange(label);
        tick();
      }, delay);
    };
    tick();
  }
}
