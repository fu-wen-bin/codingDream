// function add(a, b, c) {
//   return a + b + c
// }
// add(1, 2, 3)

function add (a) {
  return (b) => {
    return (c) => {
      return a + b + c
    }
  }
}

console.log(add(1)(2)(3))
