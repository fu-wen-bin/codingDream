let arr = [1, 2, 3, 3, 1]

// let newArr = [...new Set(arr)]
// console.log(newArr)

// function unique(arr) {
//   let res = []
//   for (let item of arr) {
//     if (!res.includes(item)) {
//       res.push(item)
//     }
//   }
//   return res
// }

function unique (arr) {
  arr.sort()  // [1, 1,  2,  3]
  // for (let i = 0; i < arr.length; i++) {
  //   let j = i + 1
  //   if (arr[i] === arr[j]) {
  //     arr.splice(j, 1)
  //     i--
  //   }
  // }

  for (let i = arr.length - 1; i >= 0; i--) {
    let j = i - 1
    if (arr[i] === arr[j]) {
      arr.splice(j, 1)
    }
  }
  return arr
}

console.log(unique(arr))
