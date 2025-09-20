import { useState } from 'react';
import Navigation from '@/components/Navigation';
import CryptoDashboard from '@/components/CryptoDashboard';
import GameModule from '@/components/GameModule';
import LearnEarn from '@/components/LearnEarn';
import SandboxMode from '@/components/SandboxMode';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userPoints] = useState(1250);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <CryptoDashboard onNavigate={setCurrentPage} />;
      case 'games':
        return <GameModule />;
      case 'learn':
        return <LearnEarn />;
      case 'sandbox':
        return <SandboxMode />;
      default:
        return <CryptoDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        userPoints={userPoints}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <main className="p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
