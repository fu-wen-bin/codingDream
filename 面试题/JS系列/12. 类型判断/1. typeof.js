console.log(typeof 123) // number
console.log(typeof 'hello') // string
console.log(typeof true) // boolean
console.log(typeof undefined) // undefined
console.log(typeof Symbol('symbol')) // symbol
console.log(typeof BigInt(123)) // bigint


// 这是一个历史遗留问题，null 在 JavaScript 中被认为是一个对象类型
// js早期将null编译成000开头，而000开头都会被认为是对象类型
console.log(typeof null) // object
console.log(typeof function () {}) // function
console.log(typeof []) // object
console.log(typeof {}) // object
console.log(typeof new Date()) // object
