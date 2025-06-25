const arr = [1, 2]

const obj = {
  name: 'FWB',
  '1': 1,
}

obj[arr] = '12'

console.log(obj['1'])
console.log(obj)

const m = new Map()
m.set(arr, 12) // key是数组，值为12
console.log(m.get(arr))  // 读取key中的value值
m.delete(arr) // 删除属性
console.log(m.has(arr)) // 是否拥有对应key