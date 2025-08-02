const root = {
  val: 'A',
  left: {
    val: 'B',
    left: {
      val: 'D',
      left: null,
      right: null,
    },
    right: {
      val: 'E',
      left: null,
      right: null,
    },
  },
  right: {
    val: 'C',
    left: {
      val: 'F',
      left: null,
      right: null,
    },
  },
}

// 前序遍历 preOrder
function preOrder (node) {
  if (!node) return
  console.log(node.val)
  preOrder(node.left)
  preOrder(node.right)
}

preOrder(root)

// 中序遍历 inOrder
function inOrder (node) {
  if (!node) return
  inOrder(node.left)
  console.log(node.val)
  inOrder(node.right)
}

inOrder(root)

// 后序遍历 postOrder
function postOrder (node) {
  if (!node) return
  postOrder(node.left)
  postOrder(node.right)
  console.log(node.val)
}

postOrder(root)

// 层序遍历 levelOrder -- 输出结果为[[A], [B, C], [D, E, F]]
function levelOrder (node) {
  if (!node) return []
  const queue = [node]
  const result = []

  while (queue.length) {
    const levelSize = queue.length
    const currentLevel = []

    for (let i = 0; i < levelSize; i++) {
      const currentNode = queue.shift()
      currentLevel.push(currentNode.val)

      if (currentNode.left) queue.push(currentNode.left)
      if (currentNode.right) queue.push(currentNode.right)
    }

    result.push(currentLevel)
  }

  return result
}
console.log(levelOrder(root))

