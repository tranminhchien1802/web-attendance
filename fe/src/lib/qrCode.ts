function multiply(a: number, b: number) {
  let result = 0;
  for (let i = 0; i < 8; i++) { if (b & 1) result ^= a; const high = a & 0x80; a = (a << 1) & 255; if (high) a ^= 0x1d; b >>>= 1; }
  return result;
}
function addBits(bits: number[], value: number, length: number) { for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1); }
function ecc(data: number[], degree: number) {
  let gen = [1], root = 1;
  for (let i = 0; i < degree; i++) { const next = new Array(gen.length + 1).fill(0); gen.forEach((c, j) => { next[j] ^= c; next[j + 1] ^= multiply(c, root); }); gen = next; root = multiply(root, 2); }
  const rem = [...data, ...new Array(degree).fill(0)];
  for (let i = 0; i < data.length; i++) { const factor = rem[i]; if (factor) for (let j = 0; j < gen.length; j++) rem[i + j] ^= multiply(gen[j], factor); }
  return rem.slice(data.length);
}
export function encodeQrV1(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  if (!bytes.length || bytes.length > 17) throw new Error("QR text must fit a version 1 code.");
  const bits: number[] = []; addBits(bits, 4, 4); addBits(bits, bytes.length, 8); bytes.forEach((b) => addBits(bits, b, 8));
  for (let i = 0; i < 4 && bits.length < 152; i++) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((n, bit) => n * 2 + bit, 0));
  for (let i = 0; data.length < 19; i++) data.push(i % 2 ? 0x11 : 0xec);
  const codewords = data.concat(ecc(data, 7)), size = 21;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false));
  const put = (x: number, y: number, dark: boolean) => { matrix[y][x] = dark; reserved[y][x] = true; };
  const finder = (left: number, top: number) => { for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) { const x = left + dx, y = top + dy; if (x < 0 || y < 0 || x >= size || y >= size) continue; const d = Math.max(Math.abs(dx - 3), Math.abs(dy - 3)); put(x, y, d !== 2 && d <= 3); } };
  finder(0, 0); finder(14, 0); finder(0, 14);
  for (let i = 8; i < 13; i++) { put(6, i, i % 2 === 0); put(i, 6, i % 2 === 0); }
  let fmt = 8, rem = fmt << 10;
  for (let i = 14; i >= 10; i--) if ((rem >>> i) & 1) rem ^= 0x537 << (i - 10);
  fmt = ((fmt << 10) | rem) ^ 0x5412;
  const fb = (i: number) => ((fmt >>> i) & 1) !== 0;
  for (let i = 0; i <= 5; i++) put(8, i, fb(i));
  put(8, 7, fb(6)); put(8, 8, fb(7)); put(7, 8, fb(8));
  for (let i = 9; i < 15; i++) put(14 - i, 8, fb(i));
  for (let i = 0; i < 8; i++) put(size - 1 - i, 8, fb(i));
  for (let i = 8; i < 15; i++) put(8, size - 15 + i, fb(i));
  put(8, size - 8, true);
  let bit = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let v = 0; v < size; v++) { const upward = ((right + 1) & 2) === 0, y = upward ? size - 1 - v : v;
      for (let offset = 0; offset < 2; offset++) { const x = right - offset; if (reserved[y][x]) continue;
        const dark = bit < codewords.length * 8 && ((codewords[bit >>> 3] >>> (7 - (bit & 7))) & 1) !== 0; bit++;
        matrix[y][x] = dark !== ((x + y) % 2 === 0);
      }
    }
  }
  return matrix;
}