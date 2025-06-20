// let a = 1
// let b = a

let obj = {
  a: 1,
}


// 1. Object.create(obj) 方法，创建一个空对象obj2，obj2的原型指向obj
let obj2 = Object.create(obj)
console.log(obj2.a) // 输出 1，因为obj2继承了obj的属性



// 2. [].concat(obj)方法，合并两个数组，返回一个新数组
let arr = [1, 2, 3]
let arr2 = [4, 5]

let arr3 = arr.concat(arr2)
// 另一种写法，使用空数组调用concat方法
let arr4 = [].concat(arr)

console.log(arr3) // 输出 [1, 2, 3, 4, 5]
console.log(arr4) // 输出 [1, 2, 3]



// 3. 解构赋值方法，将数组中的元素赋值给变量X、Y、Z
let arr5 = [1, 2, 3]
const [X, Y, Z] = arr5

console.log(X, Y, Z) // 输出 1 2 3
console.log(...arr5) // 输出 [1, 2, 3]

let ar = [...arr5]
console.log(ar) // 输出 [1, 2, 3]，使用扩展运算符将数组元素展开成新数组



// 4. arr.slice()方法，提取指定元素成新数组返回
let array = ['a', 'b', 'c', 'd', 'e']
array.splice(1, 0, 'o')  //影响原数组

let array2 = array.slice(0, arr.length) // 返回新数组，不影响新数组 --可用作拷贝
console.log(array2) // 输出 [1, 2]



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



// 6. arr.toReversed()方法，返回一个新数组，原数组不变
let arr6 = [1, 2, 3]
let newArr1 = arr6.toReversed().reverse()
console.log(newArr1, arr6)  // 输出 [1, 2, 3] [1, 2, 3]，原数组未改变

let newArr2 = arr6.reverse()
console.log(newArr2, arr6)  // 输出 [3, 2, 1] [3, 2, 1]，原数组已改变