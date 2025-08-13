const arr = [4, 6, 3, 2, 5]

// sort 方法会对原始数组进行排序，并返回排序后的数组
// 如果不传入比较函数，则会将数组元素转换为字符串，然后按照字符串的Unicode码进行排序
// 注意：sort 方法会修改原始数组
arr.sort()

arr.sort((a, b) => {
  // 按照从小到大排序
  return a - b

  // 按照从大到小排序
  // return b - a
})

console.log(arr) // [2, 3, 4, 5, 6]