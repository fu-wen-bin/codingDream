// 模拟异步请求
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

/**
 * 并发控制器类
 * 核心思想：通过任务队列和运行计数器来控制同时执行的任务数量
 *
 * 工作原理：
 * 1. 将所有任务放入队列中等待执行
 * 2. 限制同时运行的任务数量不超过设定的并发数
 * 3. 当有任务完成时，自动从队列中取出下一个任务执行
 * 4. 通过Promise包装，让调用者能够监听任务完成状态
 */
class Limit {
  constructor (parallCount = 2) {
    this.tasks = []  // 任务队列：存储等待执行的任务
    this.parallCount = parallCount  // 最大并发数量：同时执行的任务上限
    this.runningCount = 0  // 当前正在运行的任务数量
  }

  /**
   * 添加任务到队列
   * @param {Function} task - 返回Promise的异步任务函数
   * @returns {Promise} 返回一个Promise，在任务完成时resolve/reject
   */
  add (task) {
    // 返回一个Promise，让调用者能够监听任务的完成状态
    return new Promise((resolve, reject) => {
      // 将任务及其对应的resolve/reject函数存入队列
      // 这样在任务执行完成后，可以通知外部调用者
      this.tasks.push({
        task,        // 任务函数
        resolve,     // 成功回调
        reject,      // 失败回调
      })
      // 尝试执行任务（如果当前并发数未达上限）
      this._run()
    })
  }

  /**
   * 内部方法：执行任务
   * 核心逻辑：
   * 1. 检查是否可以执行新任务（未达并发上限 && 队列中有任务）
   * 2. 从队列中取出一个任务执行
   * 3. 任务完成后递归调用自己，继续执行下一个任务
   */
  _run () {
    // 判断条件：当前运行数 < 并发上限 && 队列中还有任务
    if (this.runningCount < this.parallCount && this.tasks.length) {
      // 从队列头部取出一个任务（先进先出）
      const { task, resolve, reject } = this.tasks.shift()
      // 增加运行计数
      this.runningCount++

      // 执行任务
      task()
        .then(resolve, reject)  // 将任务结果传递给外部Promise
        .finally(() => {
          // 无论成功或失败，都要：
          this.runningCount--   // 减少运行计数
          this._run()          // 递归调用，尝试执行下一个任务
        })
    }
  }
}

// 使用示例
const limit = new Limit(2)  // 创建并发控制器，最多同时执行2个任务

// 辅助函数：添加任务并打印结果
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

// 添加5个任务，但最多同时执行2个
addtask(10000, 1)  // 10秒，会失败（超过5秒）
addtask(4000, 2)   // 4秒
addtask(2000, 3)   // 2秒
addtask(7000, 4)   // 7秒，会失败（超过5秒）
addtask(1000, 5)   // 1秒

/**
 * 执行顺序分析：
 * 1. 任务1和任务2首先开始执行（达到并发上限2）
 * 2. 任务3、4、5在队列中等待
 * 3. 任务2完成后（4秒），任务3开始执行
 * 4. 任务3完成后（2秒），任务4开始执行
 * 5. 任务4完成后（7秒），任务5开始执行
 * 6. 任务1因超时失败（10秒）
 * 7. 任务5完成（1秒）
 *
 * 预期输出顺序：
 * 任务2完成（4秒后）
 * 任务3完成（6秒后）
 * 任务5完成（8秒后）
 * 任务1失败（10秒后）
 * 任务4失败（13秒后）
 */
