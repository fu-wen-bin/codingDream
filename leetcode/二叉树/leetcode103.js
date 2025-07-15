// 103. 二叉树的锯齿形层序遍历
let zigzagLevelOrder = function (node) {
  if (!node) return [] // 如果节点为空，返回空数组
  const queue = [node] // 初始化队列，包含根节点
  const result = []
  let level = 1

  while (queue.length) { // 队列不为空时循环
    const LevelSize = queue.length // 当前层的节点数量
    const currentLevel = []

    for (let i = 0; i < LevelSize; i++) {
      const currentNode = queue.shift()
      currentLevel.push(currentNode.val)

      if (currentNode.left) queue.push(currentNode.left)
      if (currentNode.right) queue.push(currentNode.right)
    }
    if (level % 2 === 0) {
      currentLevel.reverse() // 偶数层反转当前层的值
    }
    result.push(currentLevel)
    level++
  }

  return result
}