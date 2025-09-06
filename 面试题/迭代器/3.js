// const arr = [1, 2, 3]
// const iterator = arr[Symbol.iterator]()

// console.log(iterator.next());  // { value: 1, done: false }
// console.log(iterator.next());  // { value: 2, done: false }
// console.log(iterator.next());  // { value: 3, done: false }
// console.log(iterator.next());  // { value: undefined, done: true }

// function createIterator(arr) {
//   let index = 0
//   return {
//     next: function() {
//       if (index < arr.length) {
//         return {value: arr[index++], done: false }
//       } else {
//         return {value: undefined, done: true }
//       }

//     }
//   }
// }
// const myIterator = createIterator([1, 2, 3])
// console.log(myIterator.next());  // { value: 1, done: false }
// console.log(myIterator.next());  // { value: 2, done: false }
// console.log(myIterator.next());  // { value: 3, done: false }
// console.log(myIterator.next());  // { value: undefined, done: true }

let obj = {}
obj[Symbol.iterator] = function () {
  let index = 0
  return {
    next: function () {
      if (index < 3) {
        return { value: index++, done: false }
      } else {
        return { value: undefined, done: true }
      }
    },
  }
}