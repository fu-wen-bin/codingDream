import { useState } from 'react'

export default function PictureCard () {

  const [imgPreview, setImgPreview] = useState(
    'https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png')

  return (
    <div className="card">
      <input id="selectImage" type="file"
             className="input" accept=".jpg,.png,.jpeg,.gif"/>
      <label htmlFor="selectImage">
        <img src={imgPreview} alt=""/>
      </label>
    </div>
  )
}