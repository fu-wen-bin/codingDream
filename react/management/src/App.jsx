import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './views/login/Login.jsx'
import MainLayout from './views/layout/MainLayout.jsx'
import Home from './views/home/Home.jsx'
import Publish from './views/publish/Publish.jsx'

function App () {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/layout" element={<MainLayout/>}>
            <Route path="" element={<Home/>}/>
            <Route path="publish" element={<Publish/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
