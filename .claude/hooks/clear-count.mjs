// SessionStart hook (matcher "clear"): counts /clear runs in this clone.
// Every 10th one asks Claude to compact CLAUDE.md's "Ongoing work" section,
// so it stays short, current and free of repeats.
import {readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const file = join(dirname(fileURLToPath(import.meta.url)), "clear-count.txt");
let n = 0;
try { n = parseInt(readFileSync(file, "utf8"), 10) || 0; } catch {}
n += 1;
try { writeFileSync(file, String(n)); } catch {}

if (n % 10 === 0) {
  console.log(JSON.stringify({
    systemMessage: `/clear #${n}: Claude will compact the Ongoing work section of CLAUDE.md.`,
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext:
        `This is /clear number ${n}. Before anything else, compact the "## Ongoing work" ` +
        `section of CLAUDE.md: merge repeats, drop finished or stale items (check git log and ` +
        `issue state if unsure), keep open threads, next steps, key file and function names, ` +
        `and issue numbers. Keep it under about 25 lines. Change only that section, then ` +
        `commit it alone ("CLAUDE.md: compact ongoing work") and tell the user in one line.`,
    },
  }));
}
