import express from 'express'
import Home from '../pages/Home.jsx'
import { renderToString } from 'react-dom/server'

const app = express()

const content = renderToString(<Home/>)

app.get('/', (req, res) => {
  res.send(content)
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})