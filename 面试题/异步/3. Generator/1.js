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

function * foo () {  // 带星号，表示是一个生成器函数
  yield A()  // yield 表达式，暂停函数执行，并返回一个值给调用者
  yield B()
  yield C()
  yield D()
}

const it = foo()  // 调用生成器函数，返回一个迭代器对象 -- 一定有next方法
/*console.log(it.next())  // { value: Promise { <pending> }, done: false }
console.log(it.next())  // { value: undefined, done: false }
console.log(it.next())  // { value: undefined, done: true }*/
it.next.value.then(() => {
  it.next.value.then(() => {
    it.next.value(() => {
      it.next
    })
  })
})

// 带参数的生成器函数
function * foo2 (x) {
  let y = 2 * (yield(x + 1))
  let z = yield(y / 3)
  return (x + y + z)
}

const it2 = foo2(5)
console.log(it2.next())      // { value: 6, done: false }
console.log(it2.next(6))    // { value: 4, done: false }
console.log(it2.next(4))    // { value: 21, done: true }

