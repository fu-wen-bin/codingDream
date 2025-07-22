import { useComponentsStore } from '../../stores/components.tsx'
import { Segmented } from 'antd'
import { useState } from 'react'

export default function Setting () {
  const { components } = useComponentsStore()

  const [key, setKey] = useState('属性')

  return (
    <div>
      <Segmented options={['属性','外观','事件']} block
                 onChange={setKey}/>

    </div>
  )
}