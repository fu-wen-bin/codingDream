import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SSE from './SSE.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SSE />
  </StrictMode>,
)
