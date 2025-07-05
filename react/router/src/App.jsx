import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './views/Home.jsx'
import About from './views/About'
import User from './views/User.jsx'

function App () {
  return (
    <div>
      <BrowserRouter>
        <Link to="/home">首页</Link>
        <Link to="/about">关于</Link>
        <Routes>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/user" element={<User/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App