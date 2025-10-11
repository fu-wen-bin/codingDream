const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

// 定义函数：计算单个x变成好数的最少操作次数
function minOperationsToGood(x) {
  if (x <= 0n) return 0n;  // x是非正数，直接返回0（虽然问题说数组正整数，但保险起见）

  // 步骤1：移除末尾0（操作3，免费）
  while (x % 10n === 0n) {
    x /= 10n;  // 反复除以10，直到x不再以0结尾
  }

  // 初始化最小操作次数为一个大数（BigInt）
  let minOps = 1000000000000000000n;  // 相当于10^18，大到足以覆盖差值

  // 步骤2：枚举所有可能的“好”数z = d * 10^k
  for (let d = 1n; d <= 9n; d++) {  // d从1到9
    for (let k = 0n; k < 19n; k++) {  // k从0到18（10^18足够大）
      let z = d * (10n ** k);  // 计算z
      let ops = (x > z) ? x - z : z - x;  // 计算|x - z|（操作次数）
      if (ops < minOps) minOps = ops;  // 更新最小值
    }
  }

  return minOps;  // 返回该x的最小操作次数
}

void async function () {
  // 主函数：异步读取输入并计算
  let n = parseInt(await readline());  // 读取第一行：n（数组长度）
  let line = await readline();  // 读取第二行：包含n个整数的字符串
  let a = line.split(' ').map(BigInt);  // 按空格分割，转为BigInt数组

  let total = 0n;  // 初始化总操作次数
  for (let x of a) {  // 遍历数组每个元素
    total += minOperationsToGood(x);  // 计算每个x的操作次数并累加
  }

  console.log(total.toString());  // 输出总次数（转为字符串，避免大数显示问题）
}()