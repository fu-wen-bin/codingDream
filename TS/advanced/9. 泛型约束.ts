type Lengthwise = string

function log<T extends Lengthwise> (arg: T): T {
  console.log(arg.length)
  return arg
}

log('hello')
log(123)

function getProperty<T, K extends keyof T> (obj: T, key: K) {
  
}