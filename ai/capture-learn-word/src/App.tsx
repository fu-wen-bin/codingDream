import PictureCard from './components/PictureCard'
import { useState } from 'react'
// @ts-ignore
import './App.css'

export default function App () {

  const [detailExpand, setDetailExpand] = useState(false)
  const [audio, setAudio] = useState('')
  const [sentence, setSentence] = useState('')
  const [imgPreview, setImgPreview] = useState(undefined as string | undefined)
  const submit = (data: string) => {
    setImgPreview(data)
  }

  return (
    <div className="container">
      <PictureCard word="请上传图片" submit={submit} audio={audio}/>
      <div className="output">
        <div>{sentence}</div>
        <div className="detail">
          <button onClick={() => {setDetailExpand(!detailExpand)}}>
            Talk about it
          </button>

          {
            !detailExpand
              ? <div className="fold"></div> :
              <div className="expand">
                <img src={imgPreview} alt=""/>
                <div className="explanation">
                  <p>这是一个描述句子</p>
                </div>
                <div className="reply">
                  <p>这是一个回复句子</p>
                </div>
              </div>
          }


        </div>
      </div>
    </div>
  )
}