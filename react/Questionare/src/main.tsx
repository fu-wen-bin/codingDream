// @ts-ignore
import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './lib/rem.js'
import { store } from './store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App/>,
  </Provider>,
)
