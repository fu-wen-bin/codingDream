let obj = {
  like: {
    a: '唱',
    b: '跳',
    c: 'rap',
  },
  // a: undefined, // undefined 不会被序列化
  // b: function () { console.log('hello') }, // 函数不会被序列化
  // c: Symbol('symbol'), // Symbol类型不会被序列化
  // d: BigInt(12345678901234567890), // BigInt类型不会被序列化
  // e: null, // null会被序列化为null
  // f: {},
}

// 循环引用，JSON方法无法处理
// obj.a = obj.f
// obj.f.n = obj.a

// 注意：JSON.stringify() 只能处理可序列化的对象。不能用于处理函数、undefined等

let obj2 = JSON.stringify(obj) // 将对象转换为JSON字符串
console.log(obj2) // 输出 {"like":{"a":"唱","b":"跳","c":"rap"}} 文本

let obj3 = JSON.parse(obj2) // 将JSON字符串转换为对象
console.log(obj3) // 输出 { like: { a: '唱', b: '跳', c: 'rap' } }

obj3.like.a = '篮球' // 修改新对象的属性
console.log(obj2) // 输出 {"like":{"a":"唱","b":"跳","c":"rap"}} 原字符串未变
console.log(obj3) // 输出 { like: { a: '篮球', b: '跳', c: 'rap' } } 新对象已变