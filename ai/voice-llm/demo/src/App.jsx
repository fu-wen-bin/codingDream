import { useRef, useState } from 'react'

export default function App () {
  const [status, setStatus] = useState('')
  const audioRef = useRef(null)
  const [inputText, setInputText] = useState('')

  function createBlobUrl (base64AudioData) {
    let byteArrays = []
    // 转换成流式资源
    let byteCharacters = atob(base64AudioData)

    for (let offset = 0; offset < byteCharacters.length; offset++) {
      // 转换成UTF-16的格式
      let byteArray = byteCharacters.charCodeAt(offset)
      byteArrays.push(byteArray)
    }

    // 生成一个Blob对象
    let blob = new Blob([new Uint8Array(byteArrays)], { type: 'audio/mp3' })

    // 将Blob转换成一个URL本地路径
    return URL.createObjectURL(blob)
  }

  const generateAudio = async () => {
    setStatus('生成中...')
    const token = import.meta.env.VITE_ACCESS_TOKEN
    const appId = import.meta.env.VITE_APP_ID
    const clusterId = import.meta.env.VITE_CLUSTER_ID
    const voiceName = 'zh_male_shenyeboke_moon_bigtts'

    // 这里需要处理跨域问题
    const endpoint = '/tts/api/v1/tts'

    // 构建请求头
    const headers = {
      Authorization: `Bearer;${token}`,
      'Content-Type': 'application/json',
    }

    // 构建请求体
    const payload = {
      app: {
        appid: appId,
        token,
        cluster: clusterId,
      },
      user: {
        uid: 'FWB',
      },
      audio: {
        voice_type: voiceName,
        encoding: 'ogg_opus',
        speed_ratio: 1.2,
        emotion: 'happy',
      },
      request: {
        reqid: Math.random().toString(36).substring(2),
        text: inputText,
        text_type: 'plain',
        operation: 'query',
      },
    }

    // 发送 POST 请求
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    console.log(data)

    // 处理响应 -- 生成失败
    if (!data.data) {
      return setStatus('生成失败，请检查参数')
    }
    // 处理响应 -- 生成成功
    const url = createBlobUrl(data.data)

    audioRef.current.src = url
    audioRef.current.play()
  }

  return (
    <div className="container">
      <div>
        <label>Prompt</label>
        <button onClick={generateAudio}>生成&播放</button>
        <textarea rows="4" cols="30"
                  placeholder="请输入提示词"
                  onChange={(e) => setInputText(e.target.value)}

        />

      </div>
      <div className="output">
        <div>{status}</div>
        <audio ref={audioRef}></audio>
      </div>
    </div>
  )
}