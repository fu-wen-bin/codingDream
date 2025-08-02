// 使用递归遍历，在每个节点判断是否为空

let maxDepth = function (root) {
  let ans = 0

  function dfs (node, depth) {
    if (node === null) {
      return
    }
    // 如果不为空则直接返回
    depth++
    // 更新最大深度
    ans = Math.max(ans, depth)
    // 递归遍历左子树和右子树
    dfs(node.left, depth)
    dfs(node.right, depth)
  }
  dfs(root, 0)
  return ans
}