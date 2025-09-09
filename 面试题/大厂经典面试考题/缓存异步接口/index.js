function cacheApi (...args) {
  const fn = args[0]
  let cache = {}
  return async (key) => {

    // 判断是否已经请求过
    if (cache[key] && cache[key].lock) {
      // 已经请求过，并且请求已经结束，直接输出缓存的数据
      if (cache[key].data) {
        return cache[key].data
      } else {
        // 上一次同一个请求没有结束
        return cache[key].promise
      }
    }

    // 第一次发送请求 -- 初始化
    if (!cache[key]) {
      cache[key] = {}
      cache[key].lock = true
      cache[key].data = null
      cache[key].promise = fn(key)
    }

    // 不是第一次发送请求 -- 直接返回缓存的Promise对象
    if (cache[key].data) {
      cache[key].lock = true
      cache[key].promise = fn(key)
      cache[key].promise.then(res => { // 更新下一次的异步请求
        cache[key].data = res
        cache[key].lock = false
      })
      return cache[key].data
    } else {
      // 第一次被请求，等待异步请求结束，缓存promise对象
      const res = await cache[key].promise
      cache[key].data = res
      cache[key].lock = false
      return res
    }
  }
}

const ajax = (() => {
  let id = 0
  return async (req) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      req,
      id: id++,
    }
  }
})()

const cachedApi = cacheApi(ajax);

(async () => {
  // Promise.all -- 其中接收一个数组，数组中每一项都是一个 Promise 对象，每一项都同时触发
  // 数组中的所有 Promise 对象都变为 resolve 状态，Promise.all 返回的 Promise 对象才会变为 resolve 状态
  // 只要数组中有一个 Promise 对象变为 reject 状态，Promise.all 返回
  console.log(
    await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')]))
  // 第一次请求，需要 1 秒钟输出
  // [ { req: 'a', id: 1 }, { req: 'b', id: 2 }, { req: 'a', id: 1 } ]
  console.log(
    await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')]))
  // 第二次请求，立刻输出
  // [ { req: 'a', id: 1 }, { req: 'b', id: 2 }, { req: 'a', id: 1 } ]

  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log(
    await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')]))
  // 立即输出
  // [ { req: 'a', id: 2 }, { req: 'b', id: 3 }, { req: 'a', id: 2 } ]
})()