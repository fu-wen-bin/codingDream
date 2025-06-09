function mul (n) {
  if (n === 1) {  //一定要有推出条件，否则会死循环爆栈
    return 1
  }
  return n * mul(n - 1)
}

console.log(mul(3))

// mul(5)  ==> 5 * mul(4.js)
// mul(4.js)  ==> 4.js * mul(3)
// mul(3)  ==> 3 * mul(2)
// mul(2)  ==> 2 * mul(1)
// mul(1)  ==> 1