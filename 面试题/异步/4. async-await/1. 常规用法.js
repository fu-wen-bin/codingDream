function A () {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('A函数')
      resolve()
    }, 2000)
  })
}

function B () {
  console.log('B函数')
}

async function foo () {  // 带async关键字，表示是一个异步函数
  await A()  // await表达式，等待一个Promise对象resolve后，恢复函数执行，并返回resolve的值
  B()
}