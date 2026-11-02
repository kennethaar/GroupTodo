function qrEncode(text) {
  const bytes = new TextEncoder().encode(text);
  const rawModules = v => {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const na = Math.floor(v / 7) + 2; r -= (25 * na - 10) * na - 55; if (v >= 7) r -= 36; }
    return r;
  };
  const dataCodewords = v => Math.floor(rawModules(v) / 8) - QR_ECC[v - 1] * QR_BLOCKS[v - 1];
  let ver = 0;
  for (let v = 1; v <= 40 && !ver; v++) {
    const cc = v <= 9 ? 8 : 16;
    if (bytes.length < 1 << cc && 4 + cc + bytes.length * 8 <= dataCodewords(v) * 8) ver = v;
  }
  if (!ver) return null;

  // The data: mode, length, the bytes, a terminator, then padding to fill it.
  const bits = [];
  const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, ver <= 9 ? 8 : 16);
  for (const b of bytes) put(b, 8);
  const cap = dataCodewords(ver) * 8;
  put(0, Math.min(4, cap - bits.length));
  put(0, (8 - bits.length % 8) % 8);
  for (let pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) put(pad, 8);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((b, x) => b << 1 | x, 0));

  // Reed-Solomon error correction per block, then the blocks interleaved.
  const mul = (x, y) => {
    let z = 0;
    for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; }
    return z;
  };
  const nBlocks = QR_BLOCKS[ver - 1], eccLen = QR_ECC[ver - 1], raw = Math.floor(rawModules(ver) / 8);
  const nShort = nBlocks - raw % nBlocks, shortLen = Math.floor(raw / nBlocks);
  const div = new Array(eccLen).fill(0);
  div[eccLen - 1] = 1;
  for (let i = 0, root = 1; i < eccLen; i++, root = mul(root, 2))
    for (let j = 0; j < eccLen; j++) { div[j] = mul(div[j], root); if (j + 1 < eccLen) div[j] ^= div[j + 1]; }
  const blocks = [];
  for (let i = 0, k = 0; i < nBlocks; i++) {
    const len = shortLen - eccLen + (i < nShort ? 0 : 1);
    const dat = data.slice(k, k += len);
    const rem = new Array(eccLen).fill(0);
    for (const b of dat) {
      const f = b ^ rem.shift();
      rem.push(0);
      div.forEach((d, j) => { rem[j] ^= mul(d, f); });
    }
    if (i < nShort) dat.push(0);
    blocks.push(dat.concat(rem));
  }
  const words = [];
  for (let i = 0; i < blocks[0].length; i++)
    blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= nShort) words.push(b[i]); });

  // The fixed patterns: timing, the three finders, alignment, version.
  const n = ver * 4 + 17;
  const mod = Array.from({length: n}, () => new Array(n).fill(false));
  const fixed = Array.from({length: n}, () => new Array(n).fill(false));
  const set = (x, y, dark) => { mod[y][x] = dark; fixed[y][x] = true; };
  for (let i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [n - 4, 3], [3, n - 4]])
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy));
      if (x >= 0 && x < n && y >= 0 && y < n) set(x, y, d !== 2 && d !== 4);
    }
  if (ver > 1) {
    const na = Math.floor(ver / 7) + 2, step = Math.floor((ver * 8 + na * 3 + 5) / (na * 4 - 4)) * 2;
    const pos = [6];
    for (let p = n - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
    pos.forEach((a, i) => pos.forEach((b, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++)
        set(a + dx, b + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
  }
  const format = mask => {
    const d = 1 << 3 | mask;   // LOW is 01
    let r = d;
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((d << 10) | r) ^ 0x5412, bit = i => ((b >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(n - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, n - 15 + i, bit(i));
    set(8, n - 8, true);
  };
  format(0);
  if (ver >= 7) {
    let r = ver;
    for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
    const b = ver << 12 | r;
    for (let i = 0; i < 18; i++) {
      const dark = ((b >>> i) & 1) === 1, a = n - 11 + i % 3, c = Math.floor(i / 3);
      set(a, c, dark); set(c, a, dark);
    }
  }

  // The codewords, zigzagging up and down two columns at a time.
  for (let right = n - 1, i = 0; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let v = 0; v < n; v++) for (let j = 0; j < 2; j++) {
      const x = right - j, y = ((right + 1) & 2) === 0 ? n - 1 - v : v;
      if (!fixed[y][x] && i < words.length * 8) { mod[y][x] = ((words[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; }
    }
  }

  const MASKS = [(x, y) => (x + y) % 2, (x, y) => y % 2, (x, y) => x % 3, (x, y) => (x + y) % 3,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2, (x, y) => x * y % 2 + x * y % 3,
    (x, y) => (x * y % 2 + x * y % 3) % 2, (x, y) => ((x + y) % 2 + x * y % 3) % 2];
  const applyMask = m => {
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++)
      if (!fixed[y][x] && MASKS[m](x, y) === 0) mod[y][x] = !mod[y][x];
  };
  const penalty = () => {
    let p = 0;
    const line = at => {
      let color = false, len = 0;
      const hist = [0, 0, 0, 0, 0, 0, 0];
      const add = l => { if (hist[0] === 0) l += n; hist.pop(); hist.unshift(l); };
      const finders = () => {
        const c = hist[1], core = c > 0 && hist[2] === c && hist[3] === c * 3 && hist[4] === c && hist[5] === c;
        return (core && hist[0] >= c * 4 && hist[6] >= c ? 1 : 0) + (core && hist[6] >= c * 4 && hist[0] >= c ? 1 : 0);
      };
      for (let k = 0; k < n; k++) {
        if (at(k) === color) { len++; if (len === 5) p += 3; else if (len > 5) p++; }
        else { add(len); if (!color) p += finders() * 40; color = at(k); len = 1; }
      }
      if (color) { add(len); len = 0; }
      add(len + n);
      p += finders() * 40;
    };
    for (let y = 0; y < n; y++) line(x => mod[y][x]);
    for (let x = 0; x < n; x++) line(y => mod[y][x]);
    for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) {
      const c = mod[y][x];
      if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3;
    }
    const dark = mod.reduce((s, r) => s + r.filter(Boolean).length, 0), all = n * n;
    return p + (Math.ceil(Math.abs(dark * 20 - all * 10) / all) - 1) * 10;
  };
  let best = 0, least = Infinity;
  for (let m = 0; m < 8; m++) {
    applyMask(m); format(m);
    const p = penalty();
    if (p < least) { least = p; best = m; }
    applyMask(m);
  }
  applyMask(best); format(best);
  return mod;
}
