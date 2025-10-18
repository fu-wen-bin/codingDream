const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('line', function (line) {
  const [a, b] = line.trim().split(' ').map(Number)
  if (a === b) {
    console.log(0)
    rl.close()
    return
  }

  const maxNum = 2005 // 足够大的范围（a、b最大1000，操作后不超过2000）
  const distA = new Array(maxNum).fill(-1) // 记录从a出发到各城市的步数
  const distB = new Array(maxNum).fill(-1) // 记录从b出发到各城市的步数
  const queueA = [a] // 从a出发的搜索队列
  const queueB = [b] // 从b出发的搜索队列

  distA[a] = 0
  distB[b] = 0

  while (queueA.length > 0 || queueB.length > 0) {
    // 处理从a出发的搜索
    if (queueA.length > 0) {
      const curr = queueA.shift()
      // 生成三种操作的下一个城市
      const nextCities = [curr * 2, Math.floor(curr / 2), curr + 1]
      for (const next of nextCities) {
        if (next >= 0 && next < maxNum) { // 确保城市编号有效
          if (distA[next] === -1) { // 未访问过该城市
            distA[next] = distA[curr] + 1
            queueA.push(next)
            // 若该城市已被b访问过，返回总步数
            if (distB[next] !== -1) {
              console.log(distA[next] + distB[next])
              rl.close()
              return
            }
          }
        }
      }
    }

    // 处理从b出发的搜索
    if (queueB.length > 0) {
      const curr = queueB.shift()
      // 生成三种操作的下一个城市
      const nextCities = [curr * 2, Math.floor(curr / 2), curr + 1]
      for (const next of nextCities) {
        if (next >= 0 && next < maxNum) { // 确保城市编号有效
          if (distB[next] === -1) { // 未访问过该城市
            distB[next] = distB[curr] + 1
            queueB.push(next)
            // 若该城市已被a访问过，返回总步数
            if (distA[next] !== -1) {
              console.log(distA[next] + distB[next])
              rl.close()
              return
            }
          }
        }
      }
    }
  }
})