function deepCopy (obj) {
  // 检查是否为数组
  let newObj = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        newObj[key] = deepCopy(obj[key])
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  return newObj
}

// 测试
let arr = [1, 2, 3, { a: 4 }]
let arr2 = deepCopy(arr)
console.log(arr2) // 输出: [1, 2, 3, { a: 4 }]


