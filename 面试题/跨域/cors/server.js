const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://localhost:63342', // 允许跨域的源
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', // 允许的请求方法
    'Access-Control-Allow-Headers': 'Content-Type,Authorization', // 允许携带的请求头
  })
  res.end('Hello Cors')
})

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})