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

// structured(obj) 可以处理复杂数据结构和循环引用
let newObj = structuredClone(obj)
obj.like.a = '篮球'

console.log(newObj)
console.log(obj)