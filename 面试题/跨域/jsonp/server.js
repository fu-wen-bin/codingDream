const http = require('http')

const server = http.createServer((req, res) => {
  const query = new URL(req.url, `http://${req.headers.host}`).searchParams
  if (query.get('cb')) {
    const cb = query.get('cb')
    const data = 'hello world'
    const result = `${cb}("${data}")` // 'cb("hello world")'
    res.end(result)
  }
})

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})