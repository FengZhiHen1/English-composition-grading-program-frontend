import React from 'react';
import { Camera, PenTool } from 'lucide-react';

import BottomNavigation from '../components/BottomNavigation';
import FeatureCard from '../components/FeatureCard';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      <Header />

      <main className="flex-1 pb-24 pt-6 px-4">
        <div className="flex flex-wrap justify-center gap-4">
            <FeatureCard
              title="点击批改作文"
              description="拍照上传，获取专业点评和建议"
              icon={Camera}
              variant="blue"
              onClick={() => console.log('点击了批改')}
            />

            <FeatureCard
              title="点击润色作文"
              description="在原文基础上改写，让作文更出彩"
              icon={PenTool}
              variant="green"
              onClick={() => console.log('点击了润色')}
            />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Home;