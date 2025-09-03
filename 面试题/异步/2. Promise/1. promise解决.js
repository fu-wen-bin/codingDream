function A () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('A函数')
      resolve('A函数成功') // 这里可以传递成功的结果 -- 被then接收
      // reject(new Error('A函数错误')) // 这里可以传递错误的结果 -- 被catch接收
    }, 2000)
  })
}

function B () {
  setTimeout(() => {
    console.log('B函数')
  }, 1000)
}

A()
  // then 其实可以接收两个函数，第一个函数是成功的回调，第二个函数是失败的回调
  // 如果不传递第二个函数，那么错误会被catch捕获
  .then((res) => {
    console.log('A函数执行完毕', res)
  })
  .then(() => {
    console.log('than 2')
  })
  .catch((error) => {
    console.log('A错误', error)
  })