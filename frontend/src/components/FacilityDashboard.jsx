import React from 'react';
import Facility from './ui/Facility';

const FacilityDashboard = ({ patients = [] }) => {
  return <Facility patients={patients} />;
};

export default FacilityDashboard;
