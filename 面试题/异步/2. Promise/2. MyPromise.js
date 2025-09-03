class MyPromise {
  constructor (executor) {
    this.status = 'pending' // promise的状态

    this.onFullfilledCallbacks = [] // 成功的回调函数队列
    this.onRejectedCallbacks = [] // 失败的回调函数队列
    const resolve = (value) => {
      if (this.status !== 'pending') return // 状态只能修改一次
      this.status = 'fulfilled' // 修改状态
      // 在用户调用resolve时，依次调用成功的回调函数
      this.onFullfilledCallbacks.forEach(fn => fn(value))
    }

    const reject = (reason) => {
      if (this.status !== 'pending') return // 状态只能修改一次
      this.status = 'rejected' // 修改状态
      // 在用户调用reject时，依次调用失败的回调函数
      this.onRejectedCallbacks.forEach(fn => fn(reason))
    }
    executor(resolve, reject)
  }

  then (onFulfilled, onRejected) {
    // 回调函数在被调用时被储存起来
    // 判断接受的参数是否是函数
    onFulfilled = typeof onFulfilled === 'function'
                  ? onFulfilled
                  : function (value) { return value }
    onRejected = typeof onRejected === 'function'
                 ? onRejected
                 : (reason) => { throw reason }
    if (this.status === 'pending') {
      this.onFullfilledCallbacks.push(onFulfilled)
      this.onRejectedCallbacks.push(onRejected)
    }
    if (this.status === 'fulfilled') {
      onFulfilled()
    }
    if (this.status === 'rejected') {
      onRejected()
    }
  }
}

let p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
})

p.then(() => { // .then其实会立刻执行，但里面的回调函数会等到resolve或reject被调用后才会执行

})