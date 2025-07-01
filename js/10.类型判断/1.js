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



// console.log(typeof(s));
// console.log(typeof(n));
// console.log(typeof(f));
// console.log(typeof(u));
// console.log(typeof nu);
// console.log(typeof sy);
// console.log(typeof b);

//  console.log(typeof arr);   // object
//  console.log(typeof obj);   // object
//  console.log(typeof fun);   // function
// console.log(typeof date);  // object
// console.log(typeof set);   // object
// console.log(typeof map);  // object

if (typeof a === 'object' && a !== null) {
  console.log('a 一定是对象');
}