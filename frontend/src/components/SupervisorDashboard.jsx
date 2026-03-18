import React from 'react';
import Supervisor from './ui/Supervisor';

const SupervisorDashboard = ({ patients = [], supervisorName = 'Supervisor' }) => {
  // Derive CHWs from patients data or use empty array
  // In a real app, this would come from your backend
  const chws = patients.length > 0 
    ? patients.map((p, index) => ({
        id: index + 1,
        name: p.chwName || `CHW ${index + 1}`,
        zone: p.ward || 'Unknown Ward',
        sessions: 0,
        referrals: patients.filter(pat => pat.chwName === p.chwName).length,
        lastSeen: 'Recently',
        status: 'active',
      }))
    : [];

  return <Supervisor patients={patients} chws={chws} supervisorName={supervisorName} />;
};

export default SupervisorDashboard;
