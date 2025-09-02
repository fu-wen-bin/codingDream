class MyPromise {
  constructor (executor) {
    const resolve = (value) => {

    }

    const reject = (reason) => {

    }
    executor(resolve, reject)
  }
}

let p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
})

p.then(() => { // .then其实会立刻执行，但里面的回调函数会等到resolve或reject被调用后才会执行

})