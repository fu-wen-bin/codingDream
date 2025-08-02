function fib (n) {
  if (n === 1 || n === 2) {  //一定要有推出条件，否则会死循环爆栈
    return 1
  }
  return fib(n - 1) + fib(n - 2)
}

console.log(fib(10))  // 55
