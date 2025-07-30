// 反转链表
// 可以使用栈 

// 使用栈
let reverseList = function (head) {
  if (!head) return null
  const stack = []
  let current = head

  // 遍历链表将节点压入栈中
  while (current) {
    stack.push(current)
    current = current.next
  }

  // 弹出栈中的节点，重新连接链表
  const newHead = stack.pop()
  current = newHead
  // 逐个连接节点
  while (stack.length > 0) {
    current.next = stack.pop()
    current = current.next
  }

  current.next = null // 最后一个节点的 next 需要指向 null
  return newHead
}