import React from 'react';
import LiveMapComponent from './ui/livemap';

const LiveMap = ({ patients = [] }) => {
  return <LiveMapComponent patients={patients} />;
};

export default LiveMap;
