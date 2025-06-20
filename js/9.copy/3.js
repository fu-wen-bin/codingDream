// let obj = {
//   name: 'FWB',
//   age: 18,
//   like: {
//     a: '唱',
//     b: '跳',
//     c: 'rap',
//   }
// }
// let newObj = Object.assign({}, obj)
// obj.like.a = '篮球'

// console.log(newObj);



let arr = [1, 2, 3, {a: 4}]
let newArr = [].concat(arr)
arr[3].a = 40

console.log(newArr)
console.log(arr)
