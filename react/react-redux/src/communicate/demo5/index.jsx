import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { add, addList } from '../../store/modules/counterStore.js' // 导入仓库中的 add 方法 // 导入仓库中的 addList 方法

function Index () {
  // const [count, setCount] = useState(0)

  // 使用 useSelector 获取仓库中的数据
  const { count, list } = useSelector((state) => state.counter)
  const dispatch = useDispatch() // 触发器
  const addMore = useRef(null) // 创建一个 ref 引用

  const addCount = () => {
    // 使用 dispatch 调用仓库中的方法
    const action = add() // 获取 add 方法的 action 对象
    dispatch(action)
  }

  const addListItem = () => {
    // 获取 input 的值
    const inputValue = addMore.current.value // 通过 ref 获取输入框的值
    // 使用 dispatch 调用仓库中的方法
    dispatch(addList(inputValue))
  }

  return (
    <div>
      {/*<h3>{count}</h3>*/}
      {/*<button onClick={addCount}>+</button>*/}

      <input type="text" ref={addMore}/>
      <button onClick={addListItem} >添加</button>
      <ul>
        {
          list.map(item => <li key={item}>{item}</li>)
        }
      </ul>
    </div>
  )
}

export default Index