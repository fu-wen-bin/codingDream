// 21. 合并两个有序链表

//递归法
let mergeTwoLists = function (list1, list2) {
  //递归终止 分隔到不能分割 也就是两个链表有一个的next不存在了 那就没法分割问题了 只能返回
  if (list1 === null) {
    return list2
  } else if (list2 === null) {
    return list1
  } else if (list1.val < list2.val) {//当前节点谁小，就让这个较小的节点的next和另一个链表继续递归合并
    list1.next = mergeTwoLists(list1.next, list2)//分隔成合并l1.next, l2的子问题
    return list1
  } else {
    list2.next = mergeTwoLists(list1, list2.next)
    return list2
  }
}

// 迭代法
// 迭代是函数内某段代码实现循环
// 特点：1.使用循环 2.状态更新 3.条件终止 4.逐步处理

// 迭代与普通循环的区别是：
// 循环代码中参与运算的变量同时是保存结果的变量，当前保存的结果作为下一次循环计算的初始值
let mergeTwoLists2 = function (list1, list2) {
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
}
mergeTwoLists2()