import React, { useState } from 'react'
// @ts-ignore
import './index.css'

export interface PictureCardProps {
  word: string
  submit: (data: string) => void
  audio?: string
}

export default function PictureCard ({ word, submit, audio }: PictureCardProps) {

  const [imgPreview, setImgPreview] = useState(
    'https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png')

  function updateImageData (e: React.ChangeEvent<HTMLInputElement>) {
    // 获取图片
    const file = e.target.files?.[0]
    if (!file) return

    // 图片预览
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => { // 读取完成
        const data = reader.result as string
        setImgPreview(data) // 修改图片url
        submit(data) // 提交图片数据
        resolve(data)
      }
      reader.onerror = (error) => {
        reject(error) // 读取失败
      }
    })

  }

  return (
    <div className="card">
      <input id="selectImage" type="file"
             className="input" accept=".jpg,.png,.jpeg,.gif"
             onChange={updateImageData}
      />
      <label htmlFor="selectImage" className="upload">
        <img src={imgPreview} alt=""/>
      </label>
      <div className="word">
        {word}
      </div>
      <div className="playAudio">
        <img width={20}
             src="https://res.bearbobo.com/resource/upload/Omq2HFs8/playA-3iob5qyckpa.png"
             alt=""/>
      </div>
    </div>
  )
}