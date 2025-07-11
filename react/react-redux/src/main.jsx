import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// 导入总仓库
import store from './store/index.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* 使用Provider包裹App组件，传入store */}
    <App/>
  </Provider>,
)
