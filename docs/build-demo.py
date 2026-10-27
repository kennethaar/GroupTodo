"""Build docs/demo.html from the real app.

The demo is grouptodo.html itself, with docs/demo.js put in front of
it: storage kept in memory, the startup questions already answered, and a demo
vault seeded through the app's own functions. Run this again whenever
grouptodo.html changes:

    python docs/build-demo.py
"""
from pathlib import Path

HERE = Path(__file__).resolve().parent
app = (HERE.parent / "grouptodo.html").read_text(encoding="utf-8")
demo = (HERE / "demo.js").read_text(encoding="utf-8")


def replace_once(text, old, new):
    # The first match: the app also carries <head> and <title> inside the
    # pages it writes out, further down.
    if old not in text:
        raise SystemExit(f"could not find {old!r} in grouptodo.html")
    return text.replace(old, new, 1)


# Before any of the app's scripts, so storage is swapped before it is probed.
out = replace_once(app, "<head>", "<head>\n<script>\n" + demo + "</script>")
# Straight after the app seeds an empty vault, and before the first render.
out = replace_once(out, "  await seedIfEmpty();\n  scanVerbs();\n",
                   "  await seedIfEmpty();\n  GTD_DEMO.seed();\n  scanVerbs();\n")
out = replace_once(out, "<title>GroupToDo</title>", "<title>GroupToDo Demo</title>")

(HERE / "demo.html").write_text(out, encoding="utf-8", newline="\n")
print("wrote docs/demo.html")
