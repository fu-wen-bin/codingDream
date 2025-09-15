class MyPromise {
  constructor (executor) {
    // Promise有三种状态：pending(等待态)、fulfilled(成功态)、rejected(失败态)
    // 初始状态为pending
    this.status = 'pending'

    // 存储成功和失败的回调函数队列，实现异步调用时的回调收集
    this.onFullfilledCallbacks = [] // 成功的回调函数队列
    this.onRejectedCallbacks = [] // 失败的回调函数队列

    // 存储成功状态的值
    this.value = undefined
    // 存储失败状态的原因
    this.reason = undefined

    // resolve函数：将Promise状态从pending改为fulfilled
    const resolve = (value) => {
      if (this.status !== 'pending') return // 状态只能由pending转为其他状态，且只能改变一次
      this.status = 'fulfilled' // 修改状态为成功态
      this.value = value // 保存成功的值
      // 在异步操作成功时，依次执行之前通过then收集的所有成功回调
      this.onFullfilledCallbacks.forEach(fn => fn(value))
    }

    // reject函数：将Promise状态从pending改为rejected
    const reject = (reason) => {
      if (this.status !== 'pending') return // 状态只能由pending转为其他状态，且只能改变一次
      this.status = 'rejected' // 修改状态为失败态
      this.reason = reason // 保存失败的原因
      // 在异步操作失败时，依次执行之前通过then收集的所有失败回调
      this.onRejectedCallbacks.forEach(fn => fn(reason))
    }

    // 立即执行传入的executor函数，并传入resolve和reject函数
    executor(resolve, reject)
  }

  then (onFulfilled, onRejected) {
    // 参数校验：如果then的参数不是函数，需要进行值的穿透处理
    // 值穿透指的是当then中传入的不是函数时，会把上一个Promise的结果直接传递给下一个then
    onFulfilled = typeof onFulfilled === 'function'
      ? onFulfilled
      : function (value) { return value } // 默认返回值本身，实现值穿透
    onRejected = typeof onRejected === 'function'
      ? onRejected
      : (reason) => { throw reason } // 默认抛出错误，实现错误穿透

    // 如果当前Promise还处于pending状态，说明executor中包含异步操作
    // 此时需要将回调函数存入对应队列，等待状态改变时调用
    if (this.status === 'pending') {
      this.onFullfilledCallbacks.push(onFulfilled)
      this.onRejectedCallbacks.push(onRejected)
    }

    // 如果Promise已经是fulfilled状态，直接执行成功回调
    if (this.status === 'fulfilled') {
      onFulfilled(this.value) // 传入存储的值
    }

    // 如果Promise已经是rejected状态，直接执行失败回调
    if (this.status === 'rejected') {
      onRejected(this.reason) // 传入存储的原因
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