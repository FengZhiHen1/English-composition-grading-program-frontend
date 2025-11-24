import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UploadPage from './pages/UploadPage';
import AnalysisReport from './pages/AnalysisReport';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* 默认路径显示上传页面 */}
                <Route path="/" element={<UploadPage />} />
                
                {/* 报告页面 */}
                <Route path="/report" element={<AnalysisReport />} />
            </Routes>
        </Router>
    );
};

export default App;