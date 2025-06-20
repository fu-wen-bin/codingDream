let obj = {
  name: 'FWB',
  age: 20,
  like: {
    a: '唱',
    b: '跳',
    c: 'rap',
  },
  a: undefined,
  b: null,
  e: {}
}

function deepCopy (obj) {
  // 检查是否为数组
  let newObj = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {  // 确保只复制对象自身的属性，不能包括原型链上的属性
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        newObj[key] = deepCopy(obj[key])
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  return newObj
}

// 测试数组
let arr = [1, 2, 3, { a: 4 }]
let arr2 = deepCopy(arr)
console.log(arr2) // 输出: [1, 2, 3, { a: 4 }]
arr[3].a = 40 // 修改原数组的属性
console.log(arr2) // 输出: [1, 2, 3, { a: 4 }] 新数组未变

// 测试对象
let newObj = deepCopy(obj)
console.log(newObj) // 输出: { name: 'FWB', age: 20, like: { a: '唱', b: '跳', c: 'rap' }, a: undefined, b: null, e: {} }
obj.like.a = '篮球' // 修改原对象的属性
console.log(newObj) // 输出: { name: 'FWB', age: 20, like: { a: '唱', b: '跳', c: 'rap' }, a: undefined, b: null, e: {} } 新对象未变
