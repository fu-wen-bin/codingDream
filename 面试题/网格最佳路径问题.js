const rl = require('readline').createInterface({ input: process.stdin })
var iter = rl[Symbol.asyncIterator]()
const readline = async () => (await iter.next()).value

void (async function () {
  // ====================== 读取输入数据 ======================
  let line = await readline()
  if (!line) return
  const [nStr, mStr] = line.trim().split(/\s+/)
  const n = parseInt(nStr),  // 网格行数
    m = parseInt(mStr)    // 网格列数

  // 创建并填充网格数据
  const a = Array.from({ length: n }, () => [])
  for (let i = 0; i < n; i++) {
    line = await readline()
    if (!line) break
    a[i] = line.trim().split(/\s+/).map(Number)  // 每行的数据
  }

  // ====================== 预处理可能的移动方向 ======================
  // 预生成所有满足曼哈顿距离 |dx| + |dy| <= 5 的移动偏移量（不包括当前位置）
  const offsets = []
  for (let di = -5; di <= 5; di++) {
    for (let dj = -5; dj <= 5; dj++) {
      if (di === 0 && dj === 0) continue  // 排除自身位置
      if (Math.abs(di) + Math.abs(dj) <= 5) offsets.push([di, dj])  // 满足曼哈顿距离要求
    }
  }

  // ====================== 动态规划初始化 ======================
  // dp[i][j] 表示从起点(0,0)到达(i,j)的最大路径和
  // 初始化为负无穷，表示暂时不可达
  const dp = Array.from({ length: n }, () =>
    Array(m).fill(Number.NEGATIVE_INFINITY),
  )
  dp[0][0] = a[0][0]  // 起点的值作为初始路径和

  // ====================== 按值排序单元格 ======================
  // 将所有格子按数值从小到大排序，以便从小的值推导到大的值
  // 这样保证我们总是从可能的前驱状态更新到后继状态
  const cells = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      cells.push([i, j, a[i][j]])  // 存储格子坐标和对应的值
    }
  }
  cells.sort((p, q) => p[2] - q[2])  // 按格子值从小到大排序

  // ====================== 动态规划过程 ======================
  // 按照值从小到大的顺序处理每个格子
  for (const [i, j, val] of cells) {
    // 如果当前格子不可达（除了起点外），则跳过
    if (dp[i][j] === Number.NEGATIVE_INFINITY && (i !== 0 || j !== 0)) continue

    // 尝试从当前格子跳到其他可能的格子
    for (const [di, dj] of offsets) {
      const ni = i + di,  // 下一个可能位置的行
        nj = j + dj    // 下一个可能位置的列

      // 检查下一个位置是否在网格范围内
      if (ni < 0 || ni >= n || nj < 0 || nj >= m) continue

      // 只能跳到值更大的格子
      if (a[ni][nj] > a[i][j]) {
        // 更新到下一个格子的最大路径和
        dp[ni][nj] = Math.max(dp[ni][nj], dp[i][j] + a[ni][nj])
      }
    }
  }

  // ====================== 寻找最优终点 ======================
  // 终点定义：没有下一步可走的格子
  // 答案是所有可能终点中的最大路径和
  let ans = Number.NEGATIVE_INFINITY
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      // 跳过不可达的格子
      if (dp[i][j] === Number.NEGATIVE_INFINITY) continue

      // 检查当前格子是否有下一步可走
      let hasNext = false
      for (const [di, dj] of offsets) {
        const ni = i + di,
          nj = j + dj
        // 检查是否在网格范围内
        if (ni < 0 || ni >= n || nj < 0 || nj >= m) continue
        // 如果有更大的值可跳，则不是终点
        if (a[ni][nj] > a[i][j]) {
          hasNext = true
          break
        }
      }

      // 如果没有下一步可走，这是一个可能的终点
      // 更新最大路径和
      if (!hasNext) ans = Math.max(ans, dp[i][j])
    }
  }

  // 输出最终答案
  console.log(ans.toString())
})()