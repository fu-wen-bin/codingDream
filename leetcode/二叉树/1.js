function TreeNode (val) {
  this.val = val
  this.left = null
  this.right = null
}

const node = new TreeNode(1)
const node2 = new TreeNode(2)
const node3 = new TreeNode(3)

node.left = node2 // 将node2作为node的左子节点
node.right = node3 // 将node3作为node的右子节点