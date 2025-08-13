const arr = [1, [2, [3, [4, 5]]]]

// 直接flat方法实现扁平化
console.log(arr.flat(Infinity)) // [1, 2, 3, 4, 5] -- 传进去的参数表示展开的层级，Infinity表示展开所有层级

// 使用toString方法将数组转换为字符串
const res2 = arr.toString().split(',').map(Number)
console.log(res2) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
