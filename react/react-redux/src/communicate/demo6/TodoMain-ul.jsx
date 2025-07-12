import './todoList.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteTodo,
  toggleComplete,
} from '../../store/modules/todoListStore.js'

function TodoMainUl () {
  const { list } = useSelector((state) => state.todoList) // 从 Redux store 中获取 todoList
  const dispatch = useDispatch() // 触发器

  const handleChange = (id) => {
    // 调用 Redux 的 toggleComplete 来切换单个完成状态
    const action = toggleComplete(id)
    dispatch(action) // 触发 action
  }

  const handleDelete = (id) => {
    // 调用 Redux 的 deleteTodo 来删除
    // 确认框
    if (window.confirm('确定删除该任务吗？')) {
      const action = deleteTodo(id)
      dispatch(action) // 触发 action
    }
  }

  return (
    <div>
      <ul className="todo-list">
        {
          list.map(item => (
              <li className={`todo ${item.completed ? 'completed' : ''}`}
                  key={item.id}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChange(item.id)}
                  />
                  <label>{item.text}</label>
                  <button className="destroy"
                          onClick={() => handleDelete(item.id)}></button>
                </div>
              </li>
            ),
          )
        }
      </ul>
    </div>
  )
}

export default TodoMainUl