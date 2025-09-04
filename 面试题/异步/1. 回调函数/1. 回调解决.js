function A () {
  try {
    setTimeout(() => {
      console.log('A函数')
      B()
      throw new Error('A函数错误')
    }, 2000)
  } catch (error) {
    console.log('A错误', error)
  }
}

function B () {
  setTimeout(() => {
    console.log('B函数')
  }, 1000)
}

A()
