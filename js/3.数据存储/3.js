function foo () {
  var a = 1
  var b = a
  a = 2
  console.log(a) // 2
  console.log(b) // 1
}

foo()

function foo1 () {
  var a1 = { value: 1 } // a 是一个对象
  var b1 = a1 // b 引用了 a 的对象
  a1.value = 2 // 修改 a 的对象属性
  console.log(a1.value) // 输出 2
  console.log(b1.value) // 输出 2，因为 a 和 b 引用的是同一个对象
}

foo1()

// 1. 复杂数据类型存储在堆中，字面量和简单类型储存在栈中
// 2. 形如 a1 = {...} 字面量 a1 只是指向堆中对应的数据类型的形如 #001 的地址值
// 3. 所以 b1 = a1 只会把引用值赋值，所以它们共享一个地址对应的复杂数据类型
// 4. 栈中的字面量和简单类型不会共享，只有副本，因为没有引用，会直接赋值