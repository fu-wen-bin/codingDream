// BFF -- Backend For Frontend 中间层
// SSE -- Server-Sent Events 服务器发送事件
import { config } from 'dotenv'
import express from 'express'

config({
  path: ['.env.local', '.env'],
})

const openaiApiKey = process.env.VITE_DEEPSEEK_API_KEY
const app = express()
const PORT = 3000
const endpoint = 'https://api.deepseek.com/chat/completions'

app.get('/stream', async (req, res) => {
  // 设置SSE服务器响应头，告诉浏览器这是一个SSE流 -- 给前端使用的纯后端推送文本
  res.setHeader('Content-Type', 'text/event-stream')
  // 需不需要触发缓存机制
  res.setHeader('Cache-Control', 'no-cache')
  // 保持连接不断开
  res.setHeader('Connection', 'keep-alive')
  // 发送初始响应头 -- 在前端发送请求后，立刻收到响应头，响应体后续会持续收到
  res.flushHeaders()

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: req.query.question || '讲讲龟兔赛跑的故事，文字控制两百字以内',
          },
        ],
        stream: true,
      }),
    })

    // 读取流
    const reader = response.body.getReader()
    // 定义解码器
    const decoder = new TextDecoder('utf-8')
    let done = false
    let buffer = ''
    // 循环读取数据
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      // 解码数据
      const chunkValue = decoder.decode(value)
      buffer = ''
      // 按行分割数据
      const lines = chunkValue.split('\n').filter(line => line.startsWith('data: '))
      for (const line of lines) {
        const incoming = line.slice(6)
        if (incoming === '[DONE]') {
          done = true
          break
        }
        // 解析 JSON 数据
        const data = JSON.parse(incoming)
        const delta = data.choices[0].delta.content
        // 推送内容给前端
        if (delta) {
          res.write(`data: ${delta}\n\n`)
        }
      }
    }
    res.write('event: end\n') // 发送结束事件
    res.write('data: [DONE]\n\n') // 通知客户端数据流结束
    res.end() // 结束响应
  } catch (e) {
    console.log('Error:', e)
    res.write('event: error\n')
    res.write(`data: ${e.message}\n\n`)
    res.end()
  }

})

app.listen(PORT, () => {
  console.log(`SSE 服务运行在 http://localhost:${PORT}`)
})