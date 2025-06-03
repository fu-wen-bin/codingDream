// function foo() {
//   foo()
// }
// foo()


// var a = 2
// function add() {
//   var b = 10
//   return a + b
// }
// add()


// function a() {
//   function b() {
//     function c() {
//       //...
//     }
//     c()
//   }
//   b()
// }
// a()


// 递归   尾递归
function runStack(n) {
  if (n === 0) return 100
  return runStack(n - 2)
}
runStack(50000)