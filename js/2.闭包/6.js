function foo() {
  var myname = '刘洋'
  var age = 18

  return function bar() {
    console.log(myname)
  }

}
var baz = foo()
baz()
