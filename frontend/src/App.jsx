import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CHW from './components/CHW';
import SupervisorDashboard from './components/SupervisorDashboard';
import FacilityDashboard from './components/FacilityDashboard';
import LiveMap from './components/LiveMap';

function App() {
  const [currentTab, setCurrentTab] = useState('chw');
  const [patientData, setPatientData] = useState(null);
  const [patients, setPatients] = useState([]);

  const handleAnalyze = (data) => {
    setPatientData(data);
  };

  const handleSavePatient = (data) => {
    // Add patient to the list with a random status for demo purposes if not present
    const newPatient = {
      ...data,
      id: Date.now(),
      status: data.status || (Math.random() > 0.5 ? 'HIGH' : 'LOW')
    };
    setPatients([newPatient, ...patients]);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'chw':
        return <CHW onAnalyze={handleAnalyze} onSave={handleSavePatient} patients={patients} />;
      case 'supervisor':
        return <SupervisorDashboard patients={patients} />;
      case 'facility':
        return <FacilityDashboard />;
      case 'live':
        return <LiveMap />;
      default:
        return <CHW onAnalyze={handleAnalyze} onSave={handleSavePatient} patients={patients} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-900 overflow-x-hidden">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      
      <main className="flex-1 ml-20">
        <TopBar />
        <div className="min-h-[calc(100vh-5rem)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;