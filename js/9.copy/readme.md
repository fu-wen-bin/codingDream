# 必要知识回顾

## `v8`是如何存储数据的

- 栈内存：
    - 存储函数调用的上下文信息
    - 存储局部变量和参数
    - 存储函数执行时的状态
    - 栈内存的大小是固定的
- 堆内存：
    - 存储对象和数组等复杂数据结构
    - 存储动态分配的内存
    - 堆内存的大小可以动态调整

## `js`中的数据类型

- 简单类型
- 复杂类型

# 拷贝

> 复刻一个对象，和原对象结构与内容都一模一样

## 浅拷贝：只拷贝对象的最外层，原对象的属性值修改会影响新对象

### 浅拷贝其原理

> 遇到**基本数据类型则直接复制**，遇到引用**数据类型则仅仅拷贝地址**

### 现有方法实现浅拷贝

1. `Object.create(obj)`

    - 创建一个新对象，**对象原型指向源对象**
    - 继承自原对象的原型
    - 不会拷贝原对象的属性值

```js
let obj = {
  a: 1,
}

// 1. Object.create(obj) 方法，创建一个空对象obj2，obj2的原型指向obj
let obj2 = Object.create(obj)
console.log(obj2.a) // 输出 1，因为obj2继承了obj的属性
```

2. `[].concat(obj)`

    - 创建一个新数组
    - 包含原数组的所有元素
    - 不会拷贝原数组的引用类型元素

```js
// 2. [].concat(obj)方法，合并两个数组，返回一个新数组
let arr = [1, 2, 3]
let arr2 = [4, 5]

let arr3 = arr.concat(arr2)
// 另一种写法，使用空数组调用concat方法
let arr4 = [].concat(arr)

console.log(arr3) // 输出 [1, 2, 3, 4, 5]
console.log(arr4) // 输出 [1, 2, 3]
```

3. 数组解构

    - 使用扩展运算符 `...`
    - 创建一个新数组
    - 包含原数组的所有元素
    - 不会拷贝原数组的引用类型元素

```js
// 3. 解构赋值方法，将数组中的元素赋值给变量X、Y、Z
let arr5 = [1, 2, 3]
const [X, Y, Z] = arr5

console.log(X, Y, Z) // 输出 1 2 3
console.log(...arr5) // 输出 [1, 2, 3]

let ar = [...arr5]
console.log(ar) // 输出 [1, 2, 3]，使用扩展运算符将数组元素展开成新数组
```

4. `arr.slice()`

    - 创建一个新数组
    - 包含原数组的所有元素
    - 不会拷贝原数组的引用类型元素

```js
// 4. arr.slice()方法，提取指定元素成新数组返回
let array = ['a', 'b', 'c', 'd', 'e']
array.splice(1, 0, 'o')  //影响原数组

let array2 = array.slice(0, arr.length) // 返回新数组，不影响新数组 --可用作拷贝
console.log(array2) // 输出 [1, 2]
```

5. `Object.assign({}, obj)`

    - 创建一个新对象
    - 拷贝原对象的**所有可枚举属性**
    - **不会拷贝原对象的不可枚举属性和原型链上的属性**

```js
// 5. Object.assign({}, obj)，合并对象，返回一个新对象
let obj3 = {
  name: 'FWB',
  age: 20,
}

let obj4 = {
  invertName: 'BWF',
}

let newObj = Object.assign({}, obj3, obj4) // 合并对象，返回一个新对象
console.log(newObj) // 输出 { name: 'FWB', age: 20, invertName: 'BWF' }
```

6. `arr.toReversed.reverse()`

    - 创建一个新数组
    - 包含原数组的所有元素
    - 不会拷贝原数组的引用类型元素

```js
// 6. arr.toReversed()方法，返回一个新数组，原数组不变
let arr6 = [1, 2, 3]
let newArr1 = arr6.toReversed().reverse()
console.log(newArr1, arr6)  // 输出 [3, 2, 1] [1, 2, 3]，原数组未改变

let newArr2 = arr6.reverse()
console.log(newArr2, arr6)  // 输出 [3, 2, 1] [3, 2, 1]，原数组已改变
```

### 手搓浅拷贝

#### 浅拷贝过程

1. 在拷贝对象时，栈中新建一个内存空间
2. 拷贝时源对象中是**基本数据**类型则**直接复制给新对象对应属性**
3. 拷贝时源对象中是**引用数据**类型则**属性中复制该类型的地址**

    - 不开辟新的内存放新对象，所有对象共享同一个引用类型

```js
// 1. for...in会遍历所有可枚举属性，包括原型链上的属性  --可优化
function shallowCopy1 (obj) {
  let newObj = {}
  for (let key in obj) {
    newObj[key] = obj[key]

  }
  return newObj
}

// 2. Object.keys()只会返回对象自身的可枚举属性，不包括原型链上的  --优化方案一
function shallowCopy2 (obj) {
  let newObj = {}
  Object.keys(obj).forEach(key => {
    newObj[key] = obj[key]
  })
  return newObj
}

// 3. 判断显式拥有的属性，隐式拥有的属性不会被拷贝  --优化方案二
function shallowCopy3 (obj) {
  let newObj = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }
}
```

## 深拷贝：层层拷贝，新对象和源对象互相独立互不影响

### 深拷贝其原理

> 开辟新的空间存放拷贝对象，原对象中遇到**引用数据类型也开辟新空间存放**

### 现有方法实现深拷贝

1. `JSON.parse(JSON.stringify(obj))`

    - 将对象转换为`JSON`字符串
    - 再将`JSON`字符串解析为对象
    - 无法处理`function`、`undefined`、`Symbol`、`BigInt` 等**不可序列化的类型**
    - **无法处理循环引用**

```js
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
console.log(obj3) 
```

2. `structuredClone(obj)`

    - 使用**浏览器内置**的 `structuredClone` 方法
    - 可以**处理复杂数据结构和循环引用**
    - 需要浏览器支持
    - 仍然无法处理`function`

```js
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
```

3. 使用第三方库

   - 如`Lodash`的 `_.cloneDeep()`
   - **可以处理复杂数据结构和循环引用**

```js
<!-- 先引用 -->
const lodash = require('./lodash.min.js')

const obj = {
  uname: 'FWB',
  age: 20,
  hobby: ['乒乓球', '足球'],
  family: {
    baby: '福娃',
  },
}
const o = lodash.cloneDeep(obj)
console.log(o)  // 输出 { uname: 'FWB', age: 20, hobby: [ '乒乓球', '足球' ], family: { baby: '福娃' } }

o.family.baby = '老福娃'  // 修改新对象的属性

console.log(obj)  // 输出 { uname: 'FWB', age: 20, hobby: [ '乒乓球', '足球' ], family: { baby: '福娃' } }

console.log(o)  // 输出 { uname: 'FWB', age: 20, hobby: [ '乒乓球', '足球' ], family: { baby: '老福娃' } }
```

4. 使用递归函数 --手搓实现深拷贝

    - 手动实现深拷贝
    - 需要处理循环引用和特殊类型
    - 可以使用 `WeakMap` 来**解决循环引用**问题

### 手搓深拷贝

#### 深拷贝过程

1. 在拷贝对象时，栈中新建一个内存空间
2. 拷贝时源对象中是**基本数据**类型则**直接复制给新对象对应属性**
3. 拷贝时源对象中是**引用数据**类型则**新建一个内存空间存放该引用数据类型**

   - 开辟新的内存放新对象，对象之间**互相独立、互不干扰**

```js
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
```
