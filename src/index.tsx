// 引入必要的 react 库
import React from 'react';
import ReactDOM from 'react-dom/client';
// 引入应用的根组件 App
import App from './App';

// 获取 DOM 挂载点
const rootElement = document.getElementById('root');
// 确保挂载点存在
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}


// 创建 React 根并渲染应用
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>  // 启用严格模式，帮助发现潜在问题
    <App />
  </React.StrictMode>
);