class EventEmitter {

  constructor () {
    this.eventList = {} // 存储事件和对应的回调函数
  }

  // 订阅事件
  on (eventName, callback) {
    if (!this.eventList[eventName]) {
      this.eventList[eventName] = [] // 如果事件不存在，初始化为一个空数组
    }
    // 如果存在事件
    this.eventList[eventName].push(callback) // 将回调函数添加到事件列表中
  }

  // 单次订阅
  once (eventName, callback) {
    const onceCallback = () => {
      callback() // 执行回调函数
      this.off(eventName, onceCallback) // 执行完后取消订阅
    }
    this.on(eventName, onceCallback) // 先订阅事件
  }

  // 取消订阅
  off (eventName, callback) {
    // 如果本来就未订阅，即事件列表中没有对应的回调函数
    if (this.eventList[eventName].includes(callback)) {
      // 如果回调存在，则删除
      // filter不会影响原数组，所以返回值需要被接收
      this.eventList[eventName] = this.eventList[eventName].filter((item) => {
        return item !== callback // 返回不等于callback的回调函数
      })
    }
    // 如果回调函数不存在，则不做任何操作
  }

  // 事件发布
  emit (eventName) {
    if (this.eventList[eventName]) {
      // 事件存在，遍历对应事件数组触发其中的回调函数
      this.eventList[eventName].forEach(callback => {
        callback() // 执行回调函数
      })
    }
  }

}

let _event = new EventEmitter()

function FWB () {
  console.log('FWB买房')
}

function YYHY () {
  console.log('YYHY买房')
}

function HCJ () {
  console.log('HCJ买车位')
}

// 订阅行为 --> 等待发布者发布行为触发
// 订阅可以有多个
_event.on('hasHouse', FWB)
_event.on('hasHouse', YYHY)

_event.on('hasBerth', HCJ)

// 取消订阅
_event.off('hasHouse', FWB) // 取消FWB的订阅行为

// 发布行为 --> 会带来FWB函数的调用
_event.emit('hasHouse')


