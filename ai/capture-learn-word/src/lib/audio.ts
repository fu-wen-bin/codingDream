export function createBlobUrl (base64AudioData: string) {
  let byteArrays = []
  // 转换成Blob对象流式资源
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

export async function generateAudio (text: string) {

  // @ts-ignore
  const token = import.meta.env.VITE_AUDIO_ACCESS_TOKEN
  // @ts-ignore
  const appId = import.meta.env.VITE_AUDIO_APP_ID
  // @ts-ignore
  const clusterId = import.meta.env.VITE_CLUSTER_ID
  const voiceName = 'zh_male_jieshuonansheng_mars_bigtts'

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
      // 生成请求ID
      reqid: Math.random().toString(36).substring(2),
      text: text,
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
    console.log('生成音频失败', data)
    return
  }
  // 处理响应 -- 生成成功
  return createBlobUrl(data.data)
}