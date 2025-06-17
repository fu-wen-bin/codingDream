// let arr1 = [1, 4, 7];   let arr2 = [2, 3, 6, 8, 9];

let l1 = [1, 2, 4], l2 = [1, 3, 4]
// 输出：[1,1,2,3,4,4]
l1 = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 4,
      next: null
    }
  }
}
l2 = {
  val: 1,
  next: {
    val: 3,
    next: {
      val: 4,
      next: null
    }
  }
}

function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
}

var mergeTwoLists = function(list1, list2) {
  let head = new ListNode()  // {val: 0, next: null}
  let cur = head

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      cur.next = list1
      list1 = list1.next
    } else {
      cur.next = list2
      list2 = list2.next
    }
    cur = cur.next
  }

  // 当某一个链表已经穿完了
  if (list1) {
    cur.next = list1
  }
  if (list2) {
    cur.next = list2
  }

  return head.next
};

console.log(mergeTwoLists(l1, l2)); // {val: 1, next: ...}



