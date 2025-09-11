import { useState } from 'react'

export default function App () {
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState(
    '讲讲龟兔赛跑的故事，文字控制两百字以内')
  const [streaming, setStreaming] = useState(false)
  const endpoint = 'https://api.deepseek.com/chat/completions'
  const Headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
  }

  const update = async () => {
    if (!question) return
    setContent('思考中...')
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: question }],
        stream: streaming,
      }),
    })
    if (streaming) {
      // console.log(response.body.getReader())
      // 读取流
      const reader = response.body.getReader()
      // 定义解码器
      const decoder = new TextDecoder('utf-8')
      let done = false
      let buffer = ''
      setContent('')
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
          // 更新内容
          setContent((prev) => prev + delta)
        }
      }

    } else {
      const data = await response.json()
      setContent(data.choices[0].message.content)
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