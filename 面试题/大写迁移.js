const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

void async function () {
  // 读取 n 与字符串 S
  const nLine = await readline();
  if (!nLine) { console.log(''); return; }
  const n = parseInt(nLine.trim(), 10);
  const sLine = await readline();
  const arr = (sLine || '').trim().split('');
  const len = Math.min(n, arr.length);

  // 按规则处理
  let x = 1;
  const isUpper = (ch) => ch >= 'A' && ch <= 'Z';
  const isLower = (ch) => ch >= 'a' && ch <= 'z';

  for (let i = 0; i < len; i++) {
    const j = i + x;
    if (j < len && isUpper(arr[j])) {
      arr[j] = arr[j].toLowerCase();
      x += 1;
      if (isLower(arr[i])) arr[i] = arr[i].toUpperCase();
    }
  }

  console.log(arr.slice(0, len).join(''));
}()
