function debounce (fn, delay) {
  var timer = null
  return function (...args) {
    let that = this // 保存this指向
    clearTimeout(timer) // 清除上一次的定时器
    timer = setTimeout(() => {
      fn.apply(that, args)
    }, delay)
  }
}

