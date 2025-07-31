// 使用哈希表记录每次的位置
let hasCycle = function (head) {
  // 如果链表为空直接返回false
  if (!head) return false
  const map = new Set()
  while (head) {
    // 如果哈希表中已存在这个节点则返回true
    if (map.has(head)) return true

    // 哈希表中不存在这个节点则添加至哈希表中
    map.add(head)
    // 移动到下一链表节点
    head = head.next
  }
  // 若循环结束则代表链表到头，返回false
  return false
}