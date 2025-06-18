function Person() {
  // var obj = {}
  // Person.call(obj)
  this.name = '超超'
  this.age = 18
  console.log(this);

  // obj.__proto__ = Person.prototype
  // return obj
}
const p1 = new Person()
