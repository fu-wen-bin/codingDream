const co = require('co')

function asyncFunction (value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Async function with value:', value)
      resolve(value)
    }, 1000)
  })
}

function * generatorFunction () {
  const result1 = yield asyncFunction(1)
  const result2 = yield asyncFunction(2)

  return result1 + result2
}

co(generatorFunction)
  .then(res => {
    console.log('Final result:', res) // Final result: 3
  })

