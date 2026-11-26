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
/* The Next box is the button that goes on, ‹ Back small beside it (#489). */
.pside{display:grid;grid-template-columns:auto 1fr;gap:8px;min-height:0}
.pnext{display:block;text-align:left;vertical-align:top;background:#1a1a1a;border:1px solid #444;border-radius:8px;padding:12px;overflow:auto;min-height:0}
.pnext:hover,.pnext:focus-visible{background:#262626}
.pback{align-self:stretch;padding:0 14px}
button:disabled{opacity:.4;cursor:default;background:#222}
.pwaitbtn[aria-expanded=true]{background:#444}
body:has(.ptimes){grid-template-rows:auto auto 1fr auto}
.ptimes{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid #333;background:#181818}
.ptimes input{font:inherit;background:#222;color:#eee;border:1px solid #666;border-radius:6px;padding:4px 8px;min-height:28px;color-scheme:dark}
body:has(.pwait){grid-template-rows:1fr auto}
.pwait{font:600 2.2em/1.3 system-ui,sans-serif;align-self:center;text-align:center}
.pgo{margin:12px;font-size:1.2em;text-align:center}
.pstart{background:#2f6fde;border-color:#2f6fde;color:#fff;font-weight:600}
.pstart:hover,.pstart:focus-visible{background:#3d7cf0}
.pnotes{padding:12px 16px;border-top:1px solid #333;white-space:pre-wrap;max-height:40vh;overflow:auto}
.pnotes:empty::before{content:"No notes";color:#888}
.pgrid{position:fixed;inset:0;background:#111;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;padding:16px;align-content:start;counter-reset:s}
.pthumb{aspect-ratio:16/9;text-align:left;vertical-align:top;display:flex;align-items:flex-start;padding:10px;background:#000;color:#fff;font-size:1.05em;counter-increment:s;position:relative}
.pthumb::after{content:counter(s);position:absolute;right:8px;bottom:6px;color:#888;font-size:.8em}
.pthumb.here{outline:3px solid #9cf}.pthumb.sub{margin-left:16px;background:#0b0b0b}
.playout{color:#aab;white-space:pre}
.pend{padding:24px}
/* Your camera (#485): you mirrored at the top, the notes right under it. */
body:has(.pcam){grid-template-rows:auto auto auto 1fr}
body:has(.pcam):has(.ptimes){grid-template-rows:auto auto auto auto 1fr}
.pcam{display:flex;gap:12px;align-items:flex-start;padding:8px 12px;border-bottom:1px solid #333;flex-wrap:wrap}
.pcamview{width:240px;max-width:40vw;aspect-ratio:16/9;object-fit:cover;transform:scaleX(-1);border-radius:6px;background:#000}
.pcamside{display:grid;gap:8px;flex:1;min-width:240px}
.ponair{color:#ff8a80;font-weight:600}
.pcamstrip,.pcamwait{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.pcamstrip .plabel,.pcamwait .plabel{min-width:7em}
.pcam button[aria-pressed=true],.pcambtn[aria-pressed=true]{background:#2d4a66;border-color:#9cf}
/* No caret on the words, only in a line opened by a double-click (#466). */
body{caret-color:transparent}.pnow{user-select:none}
.sedit{caret-color:auto;user-select:text;font:inherit;color:#fff;background:#222;border:2px solid #9cf;border-radius:4px;padding:2px 6px;width:100%;box-sizing:border-box}
.seditbar{display:flex;gap:8px;margin:6px 0;font-weight:400}.seditbar kbd{font:inherit;opacity:.7;margin-left:4px}
`;
