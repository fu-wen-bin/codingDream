import { useState } from 'react'

export default function SSE () {
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState(
    '讲讲龟兔赛跑的故事，文字控制两百字以内')
  const [streaming, setStreaming] = useState(false)
  const endpoint = '/api/stream'

  const update = async () => {
    if (!question) return
    setContent('思考中...')

    if (streaming) {
      // 发送请求到后端 SSE 端点 -- 使用SSE时，不适用ajax，必须要事件请求
      const eventSource = new EventSource(`${endpoint}?question=${question}`)
      // 监听消息事件
      eventSource.addEventListener('message', (event) => {
        // 每当接收到新的消息时，更新内容
        console.log(event.data)
        setContent((prev) => prev + event.data)
      })
      eventSource.addEventListener('end', () => {
        eventSource.close() // 关闭连接
      })
    }
  }

  return (
    <div>
      <div className="container">
        <label>输入：</label>
        <input type="text"
               defaultValue={question}
               onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={update}>提交</button>
      </div>
      <div className="output">
        <div>
          <label>Streaming</label>
          <input type="checkbox"
                 onChange={(e) => setStreaming(e.target.checked)}/>
          <div style={{
            minHeight: '300px',
            width: '500px',
            border: '1px solid #ccc',
            marginTop: '20px',
            padding: '10px',
          }}>{content}</div>
        </div>
      </div>
    </div>
  )
}