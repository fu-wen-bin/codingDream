// 环形链表进阶版，如果有环则返回入环的第一个节点的位置
// 同样使用哈希表解决查询问题，这一次将使用带key的哈希表来存储节点
let detectCycle = function (head) {
  // 如果链表为空直接返回null
  if (!head) return null
  const map = new Set()
  while (head) {
    // 如果哈希表中已存在这个节点则返回下标
    if (map.has(head)) return head

    // 哈希表中不存在这个节点则添加至哈希表中
    map.add(head)
    // 移动到下一链表节点
    head = head.next
  }
  // 若循环结束则代表链表到头，返回false
  return null
}