// 相交链表
// 可以使用双指针和哈希表两种方法来解决这个问题。

// 哈希表解法
function getIntersectionNode (headA, headB) {

    const map = new Map()
    while (headA) {
      map.set(headA)
      headA = headA.next
    }
    while (headB) {
      if (map.has(headB)) {
        return headB
      }
      headB = headB.next
    }
    return null
}
