import PictureCard from './components/PictureCard'
import { useState } from 'react'
// @ts-ignore
import './App.css'
import { generateAudio } from './lib/audio.ts'

// 用户提示词
const userPrompt = `
分析图片内容，找出最能描述该图片的一个单词。尽量选择一个常用的单词，避免使用生僻词。

返回一个 JSON 对象格式：
{
  "image_description": "图片的描述",
  "representative_word": "最能描述该图片的单词",
  "example_sentence": "结合英文单词和图片描述，给出一个简单的例句",
  "explanation": "结合图片解析英文单词，段落以Look at ... 开头，将段落分句，每句单独一行。解析的最后给出一个日常生活有关的问句",
  "example_reply": ["根据explanation给出的回复1", "根据explanation给出的回复2"]
}
`

export default function App () {

  const [detailExpand, setDetailExpand] = useState(false)
  const [audio, setAudio] = useState(undefined as string | undefined)
  const [sentence, setSentence] = useState('')
  const [imgPreview, setImgPreview] = useState(undefined as string | undefined)
  const [word, setWord] = useState('请上传图片')
  const [explanation, setExplanation] = useState('')
  const [reply, setReply] = useState([] as string[])

  const submit = async (data: string) => {
    setImgPreview(data)
    // 图片分析
    const endpoint = 'https://api.moonshot.cn/v1/chat/completions'

    const headers = {
      // @ts-ignore
      'Authorization': `Bearer ${import.meta.env.VITE_KIMI_API_KEY}`,
      'Content-Type': 'application/json',
    }
    setWord('正在分析图片...')
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'moonshot-v1-8k-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: data,
                },
              },
              {
                type: 'text',
                text: userPrompt,
              },
            ],
          },
        ],
      }),
    })

    // 处理响应
    const res = await response.json()
    const replyContent = res.choices[0].message.content
    console.log(replyContent)

    try {
      // 解析返回的JSON字符串为对象
      const replyData = JSON.parse(replyContent)
      setWord(replyData.representative_word)
      setSentence(replyData.example_sentence)
      setExplanation(replyData.explanation)
      setReply(replyData.example_reply || [])

      // 生成音频
      const audioUrl = await generateAudio(replyData.representative_word)
      setAudio(audioUrl)

    } catch (error) {
      console.error('解析API返回数据失败:', error)
      setWord('图片分析失败')
    }
  }

  return (
    <div className="container">
      <PictureCard word={word} submit={submit} audio={audio}/>
      <div className="output">
        <div>{sentence}</div>
        <div className="detail">

          <button onClick={() => {setDetailExpand(!detailExpand)}}>
            {
              !detailExpand ? 'Talk about it' : 'Fold it'
            }
          </button>

          {
            !detailExpand
              ? <div className="fold"></div> :
              <div className="expand">
                <img src={imgPreview} alt=""/>
                <div className="explanation">
                  {
                    explanation.split('\n').map(
                      (item) => <p key={item}>{item}</p>)
                  }
                </div>
                <div className="reply">
                  {
                    reply.map((item) => <p key={item}>{item}</p>)
                  }
                </div>
              </div>
          }


        </div>
      </div>
    </div>
  )
}