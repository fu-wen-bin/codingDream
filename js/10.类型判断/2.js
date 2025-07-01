let s = 'hello'   // string
let n = 123  // number
let f = true   // boolean
let u = undefined  // undefined
let nu = null  // object
let sy = Symbol(1)  // symbol
let b = 1231231231n  // bigint


let arr = []
let obj = {}
let fun = function() {}
let date = new Date()
let set = new Set()
let map = new Map()

console.log(arr instanceof Array);  // true   arr.__proto__ === Array.prototype.__proto__ ===  Object.prototype.__proto__ === null
console.log(arr instanceof Object);  // true
// console.log(obj instanceof Object); // true
// console.log(fun instanceof Function); // true
// console.log(date instanceof Date); // true
// console.log(set instanceof Set); // true
// console.log(map instanceof Map); // true



// console.log(s instanceof String)  // false
// console.log(n instanceof Number)   // false
// console.log(f instanceof Boolean)  // false
// console.log(sy instanceof Symbol)  // false
// console.log(b instanceof BigInt)  // true


function Parent() {}

Child.prototype = new Parent()
function Child() {}
let c = new Child()

c.__proto__ = Child.prototype.__proto__ === Parent.prototype