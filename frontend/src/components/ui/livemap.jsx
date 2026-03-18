import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, Layers, Search, Navigation, 
  Hospital, User, Shield, Info, Activity,
  ChevronRight, MapPin, Phone, AlertCircle
} from 'lucide-react';

// Kenyan Wards Data
const KENYAN_WARDS = [
  { value: 'Dagoretti', label: 'Dagoretti - Nairobi' },
  { value: 'Embakasi', label: 'Embakasi - Nairobi' },
  { value: 'Kamukunji', label: 'Kamukunji - Nairobi' },
  { value: 'Kasarani', label: 'Kasarani - Nairobi' },
  { value: 'Kibera', label: 'Kibera - Nairobi' },
  { value: 'Makadara', label: 'Makadara - Nairobi' },
  { value: 'Mathare', label: 'Mathare - Nairobi' },
  { value: 'Ruaraka', label: 'Ruaraka - Nairobi' },
  { value: 'Westlands', label: 'Westlands - Nairobi' },
  { value: 'Karen', label: 'Karen - Nairobi' },
  { value: 'Kilimani', label: 'Kilimani - Nairobi' },
  { value: 'Nyaya', label: 'Nyaya - Nairobi' },
  { value: 'Starehe', label: 'Starehe - Nairobi' },
  { value: 'Langata', label: 'Langata - Nairobi' },
  { value: 'IlalaWest', label: 'Ilala West - Mombasa' },
  { value: 'MombasaWest', label: 'Mombasa West - Mombasa' },
  { value: 'MombasaEast', label: 'Mombasa East - Mombasa' },
  { value: 'KisauniWest', label: 'Kisauni West - Mombasa' },
  { value: 'Nyali', label: 'Nyali - Mombasa' },
  { value: 'Jomvu', label: 'Jomvu - Mombasa' },
  { value: 'KigamboniWest', label: 'Kigamboni West - Mombasa' },
  { value: 'Kisauni', label: 'Kisauni - Mombasa' },
  { value: 'KadhadhWest', label: 'Khadhadh West - Kisumu' },
  { value: 'CentralWest', label: 'Central West - Kisumu' },
  { value: 'EastWest', label: 'East West - Kisumu' },
  { value: 'NorthWest', label: 'North West - Kisumu' },
];

const LiveMap = ({ patients = [] }) => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeCHWs, setActiveCHWs] = useState([]);
  const [showLayers, setShowLayers] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);

  // Real Kenyan Healthcare Facilities
  const facilities = [
    { 
      id: 'f1', 
      name: 'Kenyatta National Hospital', 
      type: 'Public Teaching Hospital',
      location: 'Nairobi - Kibera',
      x: 250, 
      y: 120, 
      color: 'text-blue-400',
      beds: 1800,
      services: 'ICU, Emergency, Surgery, Cardiology',
      phone: '+254 20 726 3000'
    },
    { 
      id: 'f2', 
      name: 'Nairobi Hospital', 
      type: 'Private Hospital',
      location: 'Nairobi - Westlands',
      x: 450, 
      y: 180, 
      color: 'text-green-400',
      beds: 350,
      services: 'Emergency, General Surgery, Ophthalmology',
      phone: '+254 20 822 5000'
    },
    { 
      id: 'f3', 
      name: 'Coast General Hospital', 
      type: 'Public Hospital',
      location: 'Mombasa - Old Town',
      x: 120, 
      y: 380, 
      color: 'text-cyan-400',
      beds: 600,
      services: 'Emergency, Trauma, General Medicine',
      phone: '+254 41 222 2211'
    },
    { 
      id: 'f4', 
      name: 'Kisumu Teaching & Referral Hospital', 
      type: 'Public Teaching Hospital',
      location: 'Kisumu - Central',
      x: 380, 
      y: 420, 
      color: 'text-purple-400',
      beds: 700,
      services: 'ICU, Surgery, Pediatrics, Maternity',
      phone: '+254 57 202 8000'
    },
    { 
      id: 'f5', 
      name: 'Embu Teaching & Referral Hospital', 
      type: 'Public Teaching Hospital',
      location: 'Embu - Central',
      x: 550, 
      y: 250, 
      color: 'text-orange-400',
      beds: 450,
      services: 'Emergency, General Surgery, Pediatrics',
      phone: '+254 68 203 1500'
    },
    { 
      id: 'f6', 
      name: 'Nyeri Teaching & Referral Hospital', 
      type: 'Public Teaching Hospital',
      location: 'Nyeri - Central',
      x: 480, 
      y: 180, 
      color: 'text-red-400',
      beds: 350,
      services: 'General Medicine, Surgery, Maternity',
      phone: '+254 61 203 2626'
    },
  ];

  // Active CHWs in Different Wards
  const chws = [
    { id: 'c1', name: 'Sarah Mwangi', ward: 'Kibera Ward', x: 180, y: 140, status: 'Active', patients: 12, lastUpdate: '2 min ago' },
    { id: 'c2', name: 'John Kipchoge', ward: 'Langata Ward', x: 320, y: 200, status: 'Active', patients: 8, lastUpdate: '5 min ago' },
    { id: 'c3', name: 'Mary Karanja', ward: 'Embakasi Ward', x: 420, y: 150, status: 'Active', patients: 15, lastUpdate: '1 min ago' },
    { id: 'c4', name: 'Peter Omondi', ward: 'Mathare Ward', x: 380, y: 260, status: 'Idle', patients: 0, lastUpdate: '15 min ago' },
    { id: 'c5', name: 'Grace Njeri', ward: 'Makadara Ward', x: 520, y: 380, status: 'Active', patients: 10, lastUpdate: '3 min ago' },
  ];

  const supervisors = [
    { id: 's1', name: 'Dr. James Omari', region: 'Nairobi Central', x: 320, y: 220, contact: '+254 722 123 456' },
    { id: 's2', name: 'Dr. Elizabeth Koech', region: 'Coastal Region', x: 150, y: 380, contact: '+254 722 987 654' },
    { id: 's3', name: 'Dr. Moses Kipchoge', region: 'Rift Valley', x: 380, y: 420, contact: '+254 722 654 321' },
  ];

  // Ward to facility mapping
  const wardToFacility = {
    'Kibera': 'f1',
    'Embakasi': 'f1', 
    'Langata': 'f2',
    'Westlands': 'f2',
    'Makadara': 'f1',
    'Mathare': 'f1',
    'IlalaWest': 'f3',
    'MombasaWest': 'f3',
    'MombasaEast': 'f3',
    'KisauniWest': 'f3',
    'Nyali': 'f3',
    'Jomvu': 'f3',
    'KigamboniWest': 'f3',
    'Kisauni': 'f3',
    'KadhadhWest': 'f4',
    'CentralWest': 'f4',
    'EastWest': 'f4',
    'NorthWest': 'f4',
  };

  // Get referrals from patients, filtered by selected ward
  const referrals = patients.filter(p => !selectedWard || p.ward === selectedWard).map((p, i) => ({
    id: `ref-${i}`,
    patient: p.fullName,
    ward: p.ward,
    facility: wardToFacility[p.ward] || 'f1',
    priority: p.status || 'normal'
  }));

  // Filter facilities based on selected ward
  const filteredFacilities = selectedWard
    ? facilities.filter(f => Object.values(wardToFacility).includes(f.id) && wardToFacility[selectedWard] === f.id)
    : facilities;

  useEffect(() => {
    // Simulate CHW status updates
    const interval = setInterval(() => {
      setActiveCHWs(chws.filter(c => c.status === 'Active'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runAnalysis = () => {
    if (!selectedWard) {
      alert('Please select a ward first to optimize referrals');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Get the facility for the selected ward
      const facilityId = wardToFacility[selectedWard];
      const bestFacility = facilities.find(f => f.id === facilityId) || facilities[0];
      
      // Generate dynamic distance and ETA based on ward
      const distances = ['1.2km', '2.1km', '3.5km', '4.8km', '5.3km', '6.2km'];
      const etas = ['3 mins', '5 mins', '8 mins', '10 mins', '12 mins', '15 mins'];
      const randomIdx = Math.floor(Math.random() * distances.length);
      
      setAnalysisResult({
        bestMatch: bestFacility,
        distance: distances[randomIdx],
        eta: etas[randomIdx],
        ward: selectedWard
      });
    }, 2000);
  };

  return (
    <div className="max-w-full mx-auto py-8 px-8 h-[calc(100vh-10rem)] animate-in fade-in slide-in-from-bottom-6 duration-1000 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Live Coverage Map - Kenya</h2>
          <p className="text-slate-400 mt-1 font-medium">Active CHWs: <span className="text-emerald-400 font-bold">{chws.filter(c => c.status === 'Active').length}</span> | Hospitals: <span className="text-blue-400 font-bold">{facilities.length}</span></p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={!selectedWard}
          className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center space-x-2 transition-all shadow-xl ${
            selectedWard
              ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20 hover:bg-teal-400/20 cursor-pointer'
              : 'bg-slate-500/10 text-slate-500 border border-slate-500/20 cursor-not-allowed opacity-50'
          }`}
          title={selectedWard ? 'Click to optimize referrals' : 'Select a ward first'}
        >
          <Activity size={16} />
          <span>{selectedWard ? 'Optimize Referrals' : 'Select Ward First'}</span>
        </button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Main Map Area */}
        <div className="flex-[3] bg-slate-900/40 border border-slate-700/50 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
          {/* Stylized SVG Map Background with Kenya outline */}
          <div className="absolute inset-0 bg-slate-950/60 p-10">
            <svg viewBox="0 0 800 600" className="w-full h-full opacity-40 fill-none stroke-slate-600 stroke-[2px]">
              {/* Kenya outline (simplified) */}
              <path d="M100,80 L200,50 L350,40 L500,60 L650,80 L700,150 L720,300 L700,450 L600,520 L400,550 L200,540 L80,450 L50,250 Z" strokeWidth="2.5"/>
              
              {/* Major towns/regions */}
              <text x="320" y="120" fill="#2dd4bf" opacity="0.4" fontSize="12" fontWeight="bold">Nairobi</text>
              <text x="150" y="380" fill="#2dd4bf" opacity="0.4" fontSize="12" fontWeight="bold">Mombasa</text>
              <text x="380" y="450" fill="#2dd4bf" opacity="0.4" fontSize="12" fontWeight="bold">Kisumu</text>
              <text x="550" y="260" fill="#2dd4bf" opacity="0.4" fontSize="12" fontWeight="bold">Embu</text>
              
              {/* Grid pattern */}
              {[...Array(20)].map((_, i) => (
                [...Array(15)].map((_, j) => (
                  <circle key={`${i}-${j}`} cx={i * 40 + 20} cy={j * 40 + 20} r="0.5" fill="#2dd4bf" opacity="0.2" />
                ))
              ))}
            </svg>

            {/* Hospitals/Facilities */}
            {filteredFacilities.map(f => (
              <button 
                key={f.id} 
                onClick={() => setSelectedEntity(f)}
                className="absolute group hover:z-10" 
                style={{ left: f.x, top: f.y, transform: 'translate(-50%, -50%)' }}
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/60 group-hover:scale-125 group-hover:bg-blue-500/40 transition-all shadow-lg ${f.color}`}>
                    <Hospital size={28} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-400 rounded-full border-2 border-slate-950 animate-pulse" />
                </div>
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {f.name}
                </div>
              </button>
            ))}

            {/* CHWs */}
            {chws.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedEntity({ ...c, type: 'CHW' })}
                className="absolute group hover:z-10" 
                style={{ left: c.x, top: c.y, transform: 'translate(-50%, -50%)' }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-white hover:scale-125 transition-transform shadow-lg ${
                  c.status === 'Active' 
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-400' 
                    : 'bg-slate-500/30 border-slate-400 text-slate-400'
                }`}>
                  <User size={20} />
                </div>
                {c.status === 'Active' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className={c.status === 'Active' ? 'text-emerald-400' : 'text-slate-400'}>{c.name}</span>
                </div>
              </button>
            ))}

            {/* Supervisors */}
            {supervisors.map(s => (
              <button 
                key={s.id} 
                onClick={() => setSelectedEntity({ ...s, type: 'Supervisor' })}
                className="absolute group hover:z-10" 
                style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-400/60 text-purple-400 hover:scale-125 transition-transform shadow-lg">
                  <Shield size={22} />
                </div>
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {s.name}
                </div>
              </button>
            ))}
          </div>

          {/* Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <div className="w-24 h-24 rounded-full border-4 border-teal-400/20 border-t-teal-400 animate-spin mb-6" />
              <p className="text-white font-black uppercase tracking-[0.3em] text-sm animate-pulse">Analyzing Proximity Data...</p>
              <p className="text-slate-500 mt-2 text-xs">AI is calculating optimal referral trajectories</p>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-6 right-6 space-y-3">
            <button 
              onClick={() => setShowLayers(!showLayers)}
              className={`w-12 h-12 rounded-2xl backdrop-blur-md border flex items-center justify-center transition-all shadow-xl ${
                showLayers 
                  ? 'bg-teal-500/30 border-teal-400 text-teal-400' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Toggle layers"
            >
              <Layers size={20} />
            </button>
            <button 
              onClick={() => {
                setSelectedWard(null);
                setShowLayers(false);
              }}
              className="w-12 h-12 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-xl active:scale-95"
              title="Reset to all wards"
            >
              <Navigation size={20} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 text-xs space-y-2">
            <div className="font-bold text-white mb-2">Legend</div>
            <div className="flex items-center gap-2">
              <Hospital size={14} className="text-blue-400" />
              <span className="text-slate-300">Hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-emerald-400" />
              <span className="text-slate-300">Active CHW</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              <span className="text-slate-300">Idle CHW</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-purple-400" />
              <span className="text-slate-300">Supervisor</span>
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {/* Layers/Filter Panel */}
          {showLayers && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 animate-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 mb-4">
                <Layers className="text-teal-400" size={20} />
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Filter by Ward</h3>
              </div>
              
              {selectedWard && (
                <div className="mb-4 p-3 bg-teal-400/10 border border-teal-400/20 rounded-lg">
                  <p className="text-xs text-teal-400 font-semibold">Current Selection:</p>
                  <p className="text-white text-sm">
                    {KENYAN_WARDS.find(w => w.value === selectedWard)?.label || selectedWard}
                  </p>
                </div>
              )}
              
              <select 
                value={selectedWard || ''}
                onChange={(e) => setSelectedWard(e.target.value || null)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400/50"
              >
                <option value="">All Wards</option>
                {KENYAN_WARDS.map(ward => (
                  <option key={ward.value} value={ward.value}>{ward.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* AI Analysis Result */}
          {analysisResult && (
            <div className="bg-teal-400/5 border border-teal-400/20 rounded-3xl p-6 animate-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="text-teal-400" size={20} />
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Closest Referral</h3>
              </div>
              <div className="space-y-4">
                {analysisResult.ward && (
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-teal-400/15 mb-2">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Selected Ward</p>
                    <p className="text-teal-300 text-sm font-medium">
                      {KENYAN_WARDS.find(w => w.value === analysisResult.ward)?.label || analysisResult.ward}
                    </p>
                  </div>
                )}
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-teal-400/10">
                  <p className="text-teal-400 font-black text-lg">{analysisResult.bestMatch.name}</p>
                  <p className="text-slate-400 text-xs mt-1">{analysisResult.bestMatch.type}</p>
                  <div className="flex justify-between mt-3">
                    <span className="text-slate-500 text-xs">Distance: <b className="text-slate-300">{analysisResult.distance}</b></span>
                    <span className="text-slate-500 text-xs">ETA: <b className="text-emerald-500">{analysisResult.eta}</b></span>
                  </div>
                </div>
                <button className="w-full py-3 bg-teal-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all">
                  Notify Facility
                </button>
              </div>
            </div>
          )}

          {/* Active Referrals */}
          {referrals.length > 0 && (
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-3xl p-6 animate-in slide-in-from-right-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="text-amber-400" size={20} />
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Active Referrals</h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {referrals.slice(0, 5).map(ref => (
                  <div key={ref.id} className="p-3 bg-slate-900/50 rounded-lg border border-amber-400/10 text-sm">
                    <p className="text-amber-400 font-semibold">{ref.patient}</p>
                    <p className="text-slate-400 text-xs">{ref.ward}</p>
                  </div>
                ))}
                {referrals.length > 5 && (
                  <p className="text-slate-500 text-xs text-center pt-2">+{referrals.length - 5} more referrals</p>
                )}
              </div>
            </div>
          )}

          {/* Entity Detail Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 flex-1 flex flex-col overflow-y-auto">
            {selectedEntity ? (
              <div className="animate-in fade-in duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-4 rounded-2xl bg-slate-900/50 border border-slate-700 ${selectedEntity.color || 'text-emerald-500'}`}>
                    {selectedEntity.type === 'CHW' ? <User size={24} /> : 
                     selectedEntity.type === 'Supervisor' ? <Shield size={24} /> : 
                     <Hospital size={24} />}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg leading-none">{selectedEntity.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">{selectedEntity.type || 'Facility'}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-4">
                  {/* Location */}
                  <div className="space-y-1 pb-3 border-b border-slate-700">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                      <MapPin size={12} /> Location
                    </p>
                    <p className="text-slate-300 text-sm font-medium">{selectedEntity.location || selectedEntity.ward || selectedEntity.region}</p>
                  </div>

                  {/* Status */}
                  <div className="space-y-1 pb-3 border-b border-slate-700">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Status</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedEntity.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 
                        selectedEntity.status === 'Idle' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`} />
                      <span className={`text-xs font-bold ${
                        selectedEntity.status === 'Active' ? 'text-emerald-400' :
                        selectedEntity.status === 'Idle' ? 'text-amber-400' :
                        'text-blue-400'
                      }`}>
                        {selectedEntity.status || 'Online & Active'}
                      </span>
                    </div>
                  </div>

                  {/* CHW Additional Info */}
                  {selectedEntity.type === 'CHW' && (
                    <>
                      <div className="space-y-1 pb-3 border-b border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Patients Attended</p>
                        <p className="text-teal-400 font-bold text-lg">{selectedEntity.patients}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Last Update</p>
                        <p className="text-slate-400 text-xs">{selectedEntity.lastUpdate}</p>
                      </div>
                    </>
                  )}

                  {/* Hospital Info */}
                  {selectedEntity.type !== 'CHW' && selectedEntity.type !== 'Supervisor' && (
                    <>
                      <div className="space-y-1 pb-3 border-b border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Hospital Beds</p>
                        <p className="text-blue-400 font-bold text-lg">{selectedEntity.beds}</p>
                      </div>
                      <div className="space-y-1 pb-3 border-b border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Services</p>
                        <p className="text-slate-400 text-xs">{selectedEntity.services}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Contact</p>
                        <p className="text-slate-300 text-xs font-mono">{selectedEntity.phone}</p>
                      </div>
                    </>
                  )}

                  {/* Supervisor Contact */}
                  {selectedEntity.type === 'Supervisor' && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Phone</p>
                      <p className="text-slate-300 text-xs font-mono">{selectedEntity.contact}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mt-auto">
                  <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2">
                    <Phone size={14} />
                    <span>Contact</span>
                  </button>
                  <button className="w-full py-3 bg-slate-900/50 border border-slate-700 text-slate-400 rounded-xl text-xs font-bold hover:text-white hover:border-slate-600 transition-all">
                    View Records
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <MapPin size={48} className="text-slate-500 mb-4" />
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Click on a marker<br/>to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
