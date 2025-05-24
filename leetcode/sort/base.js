// 数组  --有序、线性、
const arr = [1, 2, 3, 4, 5, 6]
arr.unshift('hello')
arr.shift()
arr.push('world')

console.log(arr)

const arr2 = [4, 3, 5, 6, 2]
// sort 功能有限，无法实现复杂数据类型的排序
arr2.sort((a, b) => a - b)


