const arr = [1, 2, 3, 4, 5]

// myForEach
Array.prototype.myForEach = function (callback) {
  // this 在被arr调用时默认绑定在了数组实例上
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this)
  }
}

arr.myForEach((item, index, array) => {
  console.log(`item: ${item}, index: ${index}, array: ${array}`)
})

// myMap
Array.prototype.myMap = function (callback) {
  const newArr = []
  // this 在被arr调用时默认绑定在了数组实例上
  for (let i = 0; i < this.length; i++) {
    newArr.push(callback(this[i], i, this))
  }
  return newArr
}

const res = arr.myMap((item) => item * 2)
console.log(res) // [2, 4, 6, 8, 10]

// myFilter
Array.prototype.myFilter = function (callback) {
  const newArr = []
  // this 在被arr调用时默认绑定在了数组实例上
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      newArr.push(this[i])
    }
  }
  return newArr
}

const res2 = arr.myFilter((item) => item > 2)
console.log(res2) // [3, 4, 5]

// myEvery -- 需要全部满足条件
Array.prototype.myEvery = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i, this)) {
      return false
    }
  }
  return true
}

const res4 = arr.myEvery((item) => item > 2)
console.log(res4) // false

// mySome -- 只需要一个满足条件
Array.prototype.mySome = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return true
    }
  }
  return false
}

const res5 = arr.mySome((item) => item > 2)
console.log(res5) // true

// myReduce
Array.prototype.myReduce = function (callback, ...arg) {
  let prev, start = 0

  if (arg.length) {
    // 初始值存在则将第一项赋值成初始值
    prev = arg[0]
  } else {
    // 初始值不存在则将第一项变为原数组的第一个元素
    prev = this[0]
    // cur变为数组的第二个元素
    start = 1
  }

  for (let i = start; i < this.length; i++) {
    prev = callback(prev, this[i], i, this)
  }
  return prev
}

const res6 = arr.myReduce(((pre, cur) => pre + cur), 5)
console.log(res6)