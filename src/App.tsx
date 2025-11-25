import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import routes from "./routes";

function App() {
  return (
    // 全局容器设置：
    // 1. max-w-md: 限制最大宽度适配手机
    // 2. mx-auto: 居中
    // 3. min-h-screen: 最小高度占满屏幕
    // 4. shadow-2xl & border-x: 增加手机边框质感
    <div className="max-w-md mx-auto min-h-screen shadow-2xl border-x border-gray-100 relative bg-gray-50">
      <Router>
        <Routes>
          {routes.map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                r.protected ? (
                  <ProtectedRoute>{r.element}</ProtectedRoute>
                ) : (
                  r.element
                )
              }
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
