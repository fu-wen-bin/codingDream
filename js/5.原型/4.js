// const obj = {
//   foo: function() {}
// }
// obj.foo()

const arr = []
// const arr = new Array()
// Array.prototype
// arr.__proto__ = Array.prototype

arr.push(1)

// function Object() {}
console.log(Object.prototype)
console.log(Object.prototype.__proto__)

function Person () {

}

const ldh = new Person()
console.log(ldh.__proto__ === Person.prototype)
console.log(Person.prototype.__proto__ === Object.prototype)
