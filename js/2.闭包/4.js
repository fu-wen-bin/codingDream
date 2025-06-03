// function bar() {
//   console.log(myname);
// }
// function foo() {
//   var myname = "典典";
//   bar();
// }
// var myname = "傅总";
// foo()



var num = 10
function a() {
  function b() {
    var num = 20
    c()
  }
  function c() {
    console.log(num)
  }
  b()
}
a()