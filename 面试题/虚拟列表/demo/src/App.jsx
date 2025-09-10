import { useEffect, useState, useRef } from 'react'
import './App.css'

const listData = new Array(1000).fill(0).map((item, index) => {
  return { id: index, value: index }
})

export default function App() {
  const [startOffset, setStartOffset] = useState(0) // 占位容器的偏移距离
  const [startIndex, setStartIndex] = useState(0) // 起始索引
  const [endIndex, setEndIndex] = useState(0) // 结束索引
  useEffect(() => {
    setEndIndex(startIndex + visibleCount)
  }, [startIndex])
  const listRef = useRef(null) // 列表的dom 结构


  // 总列表高度
  const listHeight = listData.length * 50
  // 可以展示的列表项数
  const visibleCount = Math.ceil(500 / 50)
  // 上方偏移量对应的 style
  const getTransform = {
    transform: `translateY(${startOffset}px)`,
  }
  // 截取数据用于展示
  const visibleData = listData.slice(startIndex, Math.min(endIndex, listData.length))
  console.log(visibleData);


  const scrollEvent = () => {
    // console.log(listRef.current.scrollTop);
    const scrollTop = listRef.current.scrollTop  // 我内部的元素从我上方滚出去多少距离
    // 重新计算起始下标
    setStartIndex(Math.floor(scrollTop / 50))
    setStartOffset(scrollTop - (scrollTop % 50))
  }

  return (
    <div className='container' onScroll={scrollEvent} ref={listRef}>
      <div className="list-phantom" style={{ height: `${listHeight}px` }}></div>
      <div className="list" style={getTransform}>
        <ul>
          {visibleData.map(item => (
            <li key={item.id}>{item.value}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
