import useListStore from '../store/index.js'
import { useRef } from 'react'

export default function Head () {
  const { addData } = useListStore()
  const ref = useRef(null)

  function handleAdd () {
    const val = ref.current.value
    addData(val)
    ref.current.value = ''
  }

  return (
    <div>
      <input type="text" ref={ref} defaultValue="react"/>
      <button onClick={handleAdd}>添加</button>
    </div>
  )
}