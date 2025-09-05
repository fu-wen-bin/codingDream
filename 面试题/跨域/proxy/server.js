const http = require('http')

const server = http.createServer((req, res) => {
  // 由于前端向我们自己的服务器仍然会跨域，所以这里也需要设置响应头
  res.writeHead(200,{
    'Access-Control-Allow-Origin': 'http://localhost:63342', // 允许跨域的源
  })

  // 向下游服务器转发请求
  http.request({
    hostname: 'example.com', // 下游服务器地址
    port: '3000',
    path: '/',
    method: 'GET',
    headers: {},
  }, (proxyRes) => {
    proxyRes.on('data', (data) => {
      console.log(data)
      // 获取到的数据是一串Buffer流
      res.end(data.toString())
    })
  }).end()
})

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})

