import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 将获取到的DOM元素修饰成可以包含react语法组件的容器
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

