// 数组 reduce 方法
// arr.reduce(function (上一次值, 当前值) {}, 初始值)
const arr = [1, 5, 8]

// 1. 没有初始值
const total = arr.reduce(function (prev, current) {
  return prev + current
})
console.log(total)

// 2. 有初始值  --有初始值需要加到最后结果
const total1 = arr.reduce(function (prev, current) {
  return prev + current
}, 10)
console.log(total1)

// 3. 箭头函数写法
const total2 = arr.reduce((prev, current) => prev + current, 10)
console.log(total2)

// 无初始值
// 上一次值    当前值    返回值  (第一次循环)
//   1         5        6
// 上一次值    当前值    返回值  (第二次循环)
//   6         8        14

// 有初始值
// 上一次值    当前值    返回值  (第一次循环)  第一个值为初始值
//   10         1        11
// 上一次值    当前值    返回值  (第二次循环)
//   11         5        16
// 上一次值    当前值    返回值  (第三次循环)
//   16         8        24
