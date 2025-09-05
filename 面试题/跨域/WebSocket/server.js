const webSocket = require('ws')

const ws = new webSocket.Server({
  port: 8080,
})

let count = 0

ws.on('connection', (connection) => {
  console.log('客户端连接成功')
  connection.send('欢迎连接到WebSocket服务器')
  connection.on('message', (message) => {
    console.log('收到客户端消息:', message.toString())
  })
  setInterval(() => {
    connection.send(`服务器消息 ${++count}`)
  }, 2000)

})