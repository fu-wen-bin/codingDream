import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.tsx'
import Question from './pages/question/index'

export default function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/question" element={<Question/>}/>
      </Routes>

    </BrowserRouter>
  )
}
