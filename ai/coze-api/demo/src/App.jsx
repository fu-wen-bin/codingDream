import React, { useRef, useState } from 'react'
import './app.css'

export default function App () {

  const fileRef = useRef(null)
  const [imgPreview, setImgPreview] = useState(
    'https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png')
  const [imgUrl, setImgUrl] = useState('null')  // 工作流生成的图片
  const [status, setStatus] = useState('等待上传图片') // 状态信息

  const updateImg = () => {
    console.log(fileRef.current.files[0]) // 获取dom结构获取文件数据
    const file = fileRef.current.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file) // 将文件内内容读取成base64编码
    reader.onload = () => {
      setImgPreview(reader.result) // 设置预览图片
    }
  }

  const [uniform_number, setUniformNumber] = useState(10) // 队服编号
  const [uniform_color, setUniformColor] = useState('红') // 队服颜色
  const [position, setPosition] = useState(0) // 位置
  const [shooting_hand, setShootingHand] = useState(0) // 持杆
  const [style, setStyle] = useState('写实') // 风格

  const patToken = import.meta.env.VITE_PAT_TOKEN // 获取环境变量中的PAT令牌
  const uploadUrl = 'https://api.coze.cn/v1/files/upload' // 获取环境变量中的上传&&鉴权URL
  const workflowUrl = 'https://api.coze.cn/v1/workflow/run' // 工作流执行URL
  const workflow_id = '7536408115333808162' // 获取环境变量中的工作流ID

  async function uploadFile () { // 上传文件到Coze API
    const formData = new FormData()
    const inputFile = fileRef.current.files[0]
    if (!inputFile) return
    formData.append('file', inputFile) // 将文件对象转换成form数据 -- 二进制

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patToken}`,
      },
      body: formData,
    })

    const ret = await res.json()
    return ret.data.id

  }

  const generate = async () => {
    // 1. 上传图片并获取图片URL
    setImgUrl('图片正在上传中') // 设置上传中状态
    const file_id = await uploadFile()
    setImgUrl('上传完成，生成中') // 设置生成中状态

    // 2. 调用工作流
    const res = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id,
        parameters: {
          picture: JSON.stringify({ file_id }),
          style,
          uniform_number,
          uniform_color,
          position,
          shooting_hand,
        },
      }),
    })

    const ret = await res.json() // fetch发出的请求都需要使用json()方法解析
    const data = JSON.parse(ret.data).answer // 解析返回的数据
    setImgUrl(data) // 设置生成的图片URL
    setStatus('') // 设置完成状态

  }

  return (
    <div className="container">
      <div className="input">

        <div className="file-input">
          <input type="file" id="image" name="image" onChange={updateImg}
                 accept="image/*" required ref={fileRef}/>
        </div>

        <img className="preview" src={imgPreview} alt="preview"/>

        <div className="settings">
          <div className="selection">
            <label>队服编号：</label>
            <input type="number"
                   onChange={(e) => setUniformNumber(e.target.value)}/>
          </div>
          <div className="selection">
            <label>队服颜色：</label>
            <select onChange={(e) => setUniformColor(e.target.value)}>
              <option value="红">红</option>
              <option value="蓝">蓝</option>
              <option value="绿">绿</option>
              <option value="黄">黄</option>
              <option value="白">白</option>
              <option value="黑">黑</option>
            </select>
          </div>
        </div>

        <div className="settings">
          <div className="selection">
            <label>位置：</label>
            <select onChange={(e) => setPosition(e.target.value)}>
              <option value="0">守门员</option>
              <option value="1">前锋</option>
              <option value="2">后卫</option>
            </select>
          </div>
          <div className="selection">
            <label>持杆：</label>
            <select onChange={(e) => setShootingHand(e.target.value)}>
              <option value="0">左手</option>
              <option value="1">右手</option>
            </select>
          </div>
          <div className="selection">
            <label>风格：</label>
            <select onChange={(e) => setStyle(e.target.value)}>
              <option value="写实">写实</option>
              <option value="卡通">卡通</option>
              <option value="动漫">动漫</option>
              <option value="像素">像素</option>
              <option value="抽象">抽象</option>
              <option value="油画">油画</option>
              <option value="素描">素描</option>
              <option value="乐高">乐高</option>
            </select>
          </div>
        </div>

        <div className="generate">
          <button onClick={generate}>生成</button>
        </div>

      </div>
      <div className="output">
        <div className="generated">
          <img src={imgUrl} alt=""/>
          <div>{status}</div>
        </div>
      </div>
    </div>
  )
}