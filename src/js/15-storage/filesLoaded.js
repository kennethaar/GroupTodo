async function filesLoaded() { while (READING.size) await Promise.allSettled([...READING]); }
