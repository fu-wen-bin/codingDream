// let a = 1
// let b = a

let obj = {
  a: 1,
}

// 创建一个空对象obj2，obj2的原型指向obj
let obj2 = Object.create(obj)

let arr = [1, 2, 3]
let arr2 = [4, 5]


// concat 合并两个数组，返回一个新数组
let arr3 = arr.concat(arr2)

let arr4 = [].concat(arr) // 另一种写法，使用空数组调用concat方法


// 解构赋值，将数组中的元素赋值给变量X、Y、Z
let arr5 = [1, 2, 3]
const [X, Y, Z] = arr5

console.log(X, Y, Z)



let array = ['a', 'b', 'c', 'd', 'e']
array.splice(1, 0, 'o')  //影响原数组

let array2 = array.slice(0, 2) // 返回新数组，不影响新数组 --可用作拷贝
console.log(array2) // 输出 [1, 2]

let obj3 = {
  name: 'FWB',
  age: 20,
}

let obj4 = {
  invertName: 'BWF',
}

let newObj = Object.assign({}, obj3, obj4) // 合并对象，返回一个新对象
console.log(newObj) // 输出 { name: 'FWB', age: 20, invertName: 'BWF' }


