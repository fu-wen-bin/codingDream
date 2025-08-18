function throttle (fn, delay) {
  let oldTime = 0
  return function (...args) {
    let curTime = Date.now()
    if (curTime - oldTime >= delay) {
      fn.apply(this, ...args)
      oldTime = curTime
    }
  }
}