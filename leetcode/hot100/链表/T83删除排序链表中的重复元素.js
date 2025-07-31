let head = [1, 1, 1, 2, 3, 3]

// 删除排序链表中的重复元素
var deleteDuplicates = function (head) {
  let cur = head
  while (cur && cur.next) {
    // 已排好序，所以可以直接比较当前节点和下一个节点的值
    if (cur.val === cur.next.val) {  // 当前的值等于下一个值 1  1
      cur.next = cur.next.next
    } else {
      cur = cur.next
    }
  }

  return head
}