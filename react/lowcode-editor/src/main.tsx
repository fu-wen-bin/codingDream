import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'allotment/dist/style.css'
import './index.css'
import '@ant-design/v5-patch-for-react-19'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

createRoot(document.getElementById('root')!).render(
  <DndProvider backend={HTML5Backend}>
    <App/>
  </DndProvider>,
)
