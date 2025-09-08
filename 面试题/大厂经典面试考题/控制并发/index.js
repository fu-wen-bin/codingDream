function ajax (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (time > 5000) {
        reject()
      }
      resolve()
    }, time)
  })
}

// ajax(10000)
// ajax(8000)
// ajax(1000)
// ajax(4000)
// ajax(3000)
// ajax(7000)

class Limit {
  constructor (parallCount = 2) {
    this.tasks = []  // 任务队列
    this.parallCount = parallCount  // 并发数量
    this.runningCount = 0  // 正在运行的任务数量
  }

  add (task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({
        task,
        resolve: resolve,
        reject: reject,
      })
      this._run()
    })
  }

  _run () {
    if (this.runningCount < this.parallCount && this.tasks.length) {
      const { task, resolve, reject } = this.tasks.shift()
      this.runningCount++
      task().then(resolve, reject).finally(() => {
        this.runningCount--
        this._run()
      })
    }

  }

}

const limit = new Limit(2)

function addtask (time, name) {
  limit
    .add(() => ajax(time))
    .then(() => {
      console.log(`任务${name}完成`)
    })
    .catch(() => {
      console.log(`任务${name}失败`)
    })
}

addtask(10000, 1)
addtask(4000, 2)
addtask(2000, 3)
addtask(7000, 4)
addtask(1000, 5)


