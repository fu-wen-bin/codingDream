const arr = [1, 2, 3, 4, 5]

// map 方法会返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
// 它不会修改原始数组，按照原始数组元素顺序依次处理元素
// 如果原始数组为空，则返回一个空数组，如果原始数组中有空值，则会跳过这些空值
// 如果原始数组中有对象，则会将对象的引用作为新数组的元素
const res = arr.map((item) => {
  return item * 2
})

console.log(res) // [2, 4, 6, 8, 10]

// filter 方法会返回一个新数组，数组中的元素为原始数组中满足条件的元素

const res2 = arr.filter((item) => {
  return item > 2
})

console.log(res2) // [3, 4, 5]

// some 方法会返回一个布尔值，表示原始数组中是否有 至少 一个元素满足条件
const res3 = arr.some((item) => {
  return item > 2
})

// every 方法会返回一个布尔值，表示原始数组中是否 所有 元素都满足条件
const res4 = arr.every((item) => {
  return item > 2
})