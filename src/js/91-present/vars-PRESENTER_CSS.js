// The presenter window's own look: it is a page of its own, without the app's styles.
const PRESENTER_CSS = `
body{margin:0;font:16px/1.4 system-ui,sans-serif;background:#111;color:#eee;display:grid;grid-template-rows:auto 1fr auto;height:100vh}
button{font:inherit;background:#333;color:#eee;border:1px solid #666;border-radius:6px;padding:4px 12px;cursor:pointer;min-height:36px}
button:hover,button:focus-visible{background:#444;outline:2px solid #9cf}
.pbar{display:flex;gap:12px;align-items:center;padding:8px 12px;border-bottom:1px solid #333;flex-wrap:wrap}
.pcount{font-weight:600}.ptimer{font:600 1.6em ui-monospace,monospace;cursor:pointer;background:none;border:0}
.pclock{color:#bbb}.pgap{flex:1}
.pmain{display:grid;grid-template-columns:3fr 2fr;gap:12px;padding:12px;min-height:0}
.pnow,.pnext{border:1px solid #333;border-radius:8px;padding:12px;overflow:auto}
.pnow h2{margin:0 0 8px;font-size:1.4em}.pnow li.past{opacity:.5}.pnow li.now{font-weight:600;color:#fff}
.pnow li.later{color:#888}.plabel{color:#aaa;font-size:.85em;text-transform:uppercase;letter-spacing:.05em}
.pnext .pwhat{font-size:1.3em;margin-top:4px}
.pnotes{padding:12px 16px;border-top:1px solid #333;white-space:pre-wrap;max-height:40vh;overflow:auto}
.pnotes:empty::before{content:"No notes";color:#888}
.pgrid{position:fixed;inset:0;background:#111;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;padding:16px;align-content:start;counter-reset:s}
.pthumb{aspect-ratio:16/9;text-align:left;vertical-align:top;display:flex;align-items:flex-start;padding:10px;background:#000;color:#fff;font-size:1.05em;counter-increment:s;position:relative}
.pthumb::after{content:counter(s);position:absolute;right:8px;bottom:6px;color:#888;font-size:.8em}
.pthumb.here{outline:3px solid #9cf}.pthumb.sub{margin-left:16px;background:#0b0b0b}
.playout{color:#aab;white-space:pre}
.pend{padding:24px}
`;
