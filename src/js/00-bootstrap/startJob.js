function startJob(label) {
  const bar = el("i", {}), txt = el("span", {class: "job-t"}, label);
  const t = el("div", {class: "toast job", role: "status"},
    el("div", {class: "job-b"}, txt, el("div", {class: "jbar wait"}, bar)),
    el("button", {class: "x", title: "Hide - it carries on", onclick: () => t.remove()}, "✕"));
  const job = {
    label, shown: false,
    set(done, total, note) {
      if (total > 0) {
        t.querySelector(".jbar").classList.remove("wait");
        bar.style.width = Math.min(100, Math.round(100 * done / total)) + "%";
      }
      txt.textContent = job.label + (note ? " - " + note : "");
    },
    retitle(text) { job.label = text; txt.textContent = text; },
    // No message: it just goes (whatever failed has said so itself).
    finish(msg, level = "info") {
      JOBS.delete(job);
      clearTimeout(job.timer);
      if (!job.shown) { if (msg && level !== "info") notify(msg, level); return; }
      if (!msg) { t.remove(); return; }
      t.querySelector(".jbar").classList.remove("wait");
      bar.style.width = "100%";
      txt.textContent = msg;
      if (level !== "info") t.classList.add("warn");
      setTimeout(() => t.remove(), level === "info" ? 1800 : 9000);
    },
  };
  job.timer = setTimeout(() => { job.shown = true; $("#toasts").append(t); }, 250);
  JOBS.add(job);
  return job;
}
