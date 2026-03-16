
import React, { useState } from 'react';
import Sidebar from './components/ui/sidebar';
import TopBar from './components/topbar';
import CHW from './components/ui/CHW';
import Supervisor from './components/ui/Supervisor';
import Facility from './components/ui/Facility';
import LiveMap from './components/ui/livemap';
import Settings from './components/ui/Settings';

function App() {
  const [currentTab, setCurrentTab] = useState('chw');

  const handleAnalyze = (data) => {
    console.log('Analysis data:', data);
  };

  const renderContent = () => {
    try {
      switch (currentTab) {
        case 'chw':
          return <CHW onAnalyze={handleAnalyze} />;
        case 'supervisor':
          return <Supervisor />;
        case 'facility':
          return <Facility />;
        case 'map':
          return <LiveMap />;
        case 'settings':
          return <Settings />;
        default:
          return <CHW onAnalyze={handleAnalyze} />;
      }
    } catch (error) {
      console.error('Render error:', error);
      return <div className="text-white p-4">Error loading dashboard</div>;
    }
  };

  return (
    <div className="w-full h-screen flex bg-dark-900">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;