function Point (x, y) {
  this.x = x
  this.y = y
}

Point.prototype.toString = function () { //使用显式原型 挂载公共函数
  return `(${this.x}, ${this.y})`
}

Point.toSum = function (a, b) {  // 相当于静态方法 无法被实例对象继承
  return a + b
}

var p = new Point(1, 2)
console.log(p.toString()) // 输出: (1, 2)