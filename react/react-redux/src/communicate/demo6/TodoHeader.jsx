import { useDispatch } from 'react-redux'
import { add } from '../../store/modules/todoListStore.js'

function TodoHeader () {

  const dispatch = useDispatch() // 触发器

  const handleSubmit = (e) => {
    // 判断按下的键是否是 Enter 键，并且输入框不为空
    if (e.key === 'Enter' && e.target.value.trim()) {
      // 这里可以调用 Redux 的 add 来添加新的代办
      // add 接受一个对象，包含 id 和 text，方便传给仓库添加
      // 使用 Date.now() 作为 id
      const newTodo = {
        id: Date.now(), // 使用当前时间作为唯一 ID
        text: e.target.value.trim(), // 获取输入框的值并去除前后空格
        completed: false, /* 新的选项默认为未完成 */
      }
      const action = add(newTodo)
      dispatch(action) // 触发 action
      e.target.value = '' // 清空输入框
    }
  }
  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          autoFocus
          autoComplete="off"
          placeholder="What needs to be done?"
          onKeyDown={handleSubmit}
        />
      </header>
    </div>
  )
}

export default TodoHeader