import './todoList.css'
import TodoMain from './TodoMain.jsx'
import TodoHeader from './TodoHeader.jsx'

function TodoList () {

  return (
    <section className="todoapp">
      <TodoHeader/>
      <TodoMain/>
    </section>
  )
}

export default TodoList