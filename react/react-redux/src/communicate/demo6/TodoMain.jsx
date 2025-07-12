import './todoList.css'
import { useDispatch } from 'react-redux'
import { toggleAll } from '../../store/modules/todoListStore.js'
import TodoMainUl from './TodoMain-ul.jsx'

function TodoMain () {

  const dispatch = useDispatch() // 触发器

  function handleChangeAll () {
    // 这里可以调用 Redux 的 toggleAll 来切换所有完成状态
    const action = toggleAll()
    dispatch(action) // 触发 action
  }

  return (
    <div>
      <section className="main">
        <input id="toggle-all"
               className="toggle-all"
               type="checkbox"
               onChange={handleChangeAll}
        />
        <label htmlFor="toggle-all"></label>
        <TodoMainUl/>
      </section>
    </div>
  )
}

export default TodoMain