function executeTasks (tasks = [], retries = 0) {
  // 你的实现
  const result = []
  let index = 0
  return new Promise(async (resolve, reject) => {
    async function help (taskFn, times) {
      console.log(`任务${index}执行`)

      return taskFn()
        .then(res => {
          result.push(res)
          index++
          if (index < tasks.length) {
            return help(tasks[index], retries)
          } else {
            return result
          }
        })
        .catch(err => {
          times--
          if (times > 0) {
            console.log('重试')
            return help(taskFn, times)
          }
          reject(err)
        })
    }

    try {
      const res = await help(tasks[index], retries)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}

// 测试代码
const makeTask = (index) => {
  return () => {
    return new Promise((resolve, reject) => {
      return setTimeout(() => {
        return Math.random() > 0.5
          ? resolve(`task ${index} success`)
          : reject(new Error(`task ${index} failed`))
      }, 1000)
    })
  }
}

const tasks = [
  makeTask(0),
  makeTask(1),
  // 可继续添加任务
]

async function test () {
  try {
    const res = await executeTasks(tasks, 2)
    console.log('所有任务都成功', res)
  } catch (error) {
    console.log('任务失败', error.message)
  }
}

test()