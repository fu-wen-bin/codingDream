let temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
// 维护一个单调递减栈
// [0, 0, 0, 0, 0, 0, 0, 0]

var dailyTemperatures = function (temperatures) {
  const len = temperatures.length
  const stack = [] // 单调递减栈 [0]
  const res = new Array(len).fill(0) // 初始化结果数组

  for (let i = 0; i < len; i++) {
    // temperatures[i] 比栈顶元素大，说明找到了更高的温度
    while (stack.length && temperatures[i] >
      temperatures[stack[stack.length - 1]]) {
      const top = stack.pop() // 弹出栈顶元素的索引
      res[top] = i - top  // 计算天数差
    }
    stack.push(i) // 将当前索引压入栈中
  }
  return res // 返回结果数组
}

console.log(dailyTemperatures(temperatures)) // [1, 1, 4.js, 2, 1, 1, 0, 0]
