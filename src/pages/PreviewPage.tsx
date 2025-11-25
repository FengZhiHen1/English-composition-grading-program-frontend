import React from "react";
import Header from "@/components/Header";

const PreviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="预览" showBack={true} />
      <main className="p-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800">预览页面（未实现）</h2>
          <p className="text-sm text-gray-500 mt-2">
            该页面为占位组件，点击列表项时会导航到此处。你可以在此实现具体的报告/预览展示。
          </p>
        </div>
      </main>
    </div>
  );
};

export default PreviewPage;
