function sum (a, b, c, d) {
  return a + b + c + d
}

const currySum = curry(sum)

console.log(currySum(1, 2)(3)(4))

function curry (fn, ...args) {
  if (args.length < fn.length) {
    return (...args2) => {
      return curry(fn, ...args, ...args2)
    }
  }
  return fn(...args)
}
