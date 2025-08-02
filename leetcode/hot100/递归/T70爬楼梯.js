// 动态规划：
// 达到某个目的的所有解的个数
// 只要求解的个数，不需要具体的解

// 题目：爬楼梯
// 题目描述：
// 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
// 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

// 思路：
// 1. 假设目前已经在终点： 顶楼
// 2. 分析问题的前一步：   当前 n，前一步可以是 n-1 或 n-2，这时有多少种方法
// f(n)=f(n-1)+f(n-2)  动态推导方程式

const f = []
var climbStairs = function (n) {
  if (n === 1 || n === 2) { // 基础条件
    return n
  }
  if (f[n] === undefined) { // 如果已经计算过，直接返回
    f[n] = climbStairs(n - 1) + climbStairs(n - 2) // 递归计算
  }
  return f[n] // 返回结果
}

console.log(climbStairs(4)) // 输出 5


// 纯正动态规划实现方法
var climbStairs2 = function (n) {
  if (n === 1 || n === 2) { // 基础条件
    return n
  }
  let dp = new Array(n + 1).fill(0) // 初始化 dp 数组
  dp[1] = 1 // 第 1 阶只有一种方法
  dp[2] = 2 // 第 2 阶有两种方法
  for (let i = 3; i <= n; i++) { // 从第 3 阶开始计算
    dp[i] = dp[i - 1] + dp[i - 2] // 当前阶数的方法数等于前两阶方法数之和
  }
  return dp[n] // 返回第 n 阶的方法数
}

console.log(climbStairs2(4)) // 输出 5