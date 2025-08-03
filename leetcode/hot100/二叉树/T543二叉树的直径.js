var diameterOfBinaryTree = function (root) {
  // 默认为0是因为没有包含根节点自身的路径长度
  let ans = 0

  function depth (rootNode) {
    if (!rootNode) {
      // 如果不存在根节点，则深度为0
      return 0
    }
    // 递归，获取左子树的深度
    let L = depth(rootNode.left)
    // 递归，获取右子树的深度
    let R = depth(rootNode.right)

    /* 关键点1
    L+R+1的公式是如何而来？
    等同于：左子树深度(节点个数) + 右子树深度（节点个数） + 1个根节点
    便是这株二叉树从最左侧叶子节点到最右侧叶子节点的最长路径
    类似于平衡二叉树的最小值节点到最大值节点的最长路径
    之所以+1是因为需要经过根节点
     */
    // 获取该树的最长路径和现有最长路径中最大的那个
    ans = Math.max(ans, L + R )
    /* 关键点2
    已知根节点的左右子树的深度，
    则，左右子树深度的最大值 + 1，
    便是以根节点为数的最大深度*/
    return Math.max(L, R) + 1
  }

  depth(root)

  // 由于depth函数中没有加上数节点的自身根节点路径，直接返回的是最长路径的节点个数
  return ans
}