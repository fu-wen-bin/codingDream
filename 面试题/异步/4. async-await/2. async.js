function co (generatorFunction) {
  return new Promise((resolve, reject) => {
    const g = generatorFunction() // 获取迭代器对象

    function next (value) {
      const { value: result, done } = g.next(value) // 执行下一个yield
      if (done) {
        resolve(result) // 迭代器完成，返回最终结果
      } else {
        Promise.resolve(result)
          .then(next) // 递归调用next，传递上一个yield的结果
          .catch(err => {
            g.throw(err) // 抛出错误，让生成器函数内部处理
          })
      }
    }

    next()
  })
}