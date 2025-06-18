function xq () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('相亲成功')
      resolve()  // 成功状态，fulfilled
    }, 1000)
  })
}

function marry () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('结婚')
      resolve()  // 成功状态，fulfilled
    }, 2000)
  })
}

function baby () {
  setTimeout(() => {
    console.log('生孩子')
  }, 500)
}

// 1. 执行 xq()，立即返回一个 promise 实例对象，但是此时该对象状态为 pending（等待状态）
// 2. .then立即触发，但是其中的回调函数不会立即执行，因为 xq() 中的 resolve() 还没有被调用
// 3. 等待 xq() 中的 resolve() 执行完毕，promise 的状态变为 fulfilled（成功状态），then中的回调函数才会被触发

xq()  // 里面执行到了 resolve() 方法，状态变为 fulfilled，.then中的回调函数才被触发
  .then(() => {  // then 的源码中也返回了一个 promise 实例对象，默认继承 xq 函数返回对象的状态
    return marry() //不写 return，下一个 then 不会采用默认对象，而是由上一个 then 返回的对象状态决定
  })
  .then(() => {  // 保证第一个 then 返回的对象状态继承于marry函数返回的对象状态
  baby()
})

// xq()
// .then(() => {
//   marry()
//   .then(() => {
//     baby()
//   })
// })
