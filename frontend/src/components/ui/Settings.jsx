import React, { useState } from 'react';
import { User, Lock, Globe, Shield } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    chwId: 'CHW-2024-00456',
    assignedWard: 'Kibera',
    dataEncryption: true,
    consentManagement: true,
    biometricLock: true,
    protocolType: 'MOH',
    language: 'en',
    emergencyNumber: '+254 722 123 456',
    primaryFacility: 'Kenyatta National Hospital',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button onClick={onChange} className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-600'}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Settings & Configuration</h1>
      <p className="text-slate-400 mb-8">Manage your CHW profile, compliance, and system preferences</p>
      
      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-teal-400" size={24} />
            <h2 className="text-2xl font-bold">User Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">CHW ID</p>
              <p className="text-lg font-mono text-teal-400">{settings.chwId}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Assigned Ward</p>
              <p className="text-lg text-white">{settings.assignedWard}</p>
            </div>
          </div>
        </div>

        {/* Data Protection Act Compliance */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-blue-400" size={24} />
            <div>
              <h2 className="text-2xl font-bold">Data Protection Act Compliance</h2>
              <p className="text-slate-400 text-xs mt-1">Kenya Data Protection Act, 2019</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">End-to-End Data Encryption</p>
                <ToggleSwitch enabled={settings.dataEncryption} onChange={() => handleToggle('dataEncryption')} />
              </div>
              <p className="text-xs text-slate-400">All patient records and health data encrypted with AES-256</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Explicit Patient Consent</p>
                <ToggleSwitch enabled={settings.consentManagement} onChange={() => handleToggle('consentManagement')} />
              </div>
              <p className="text-xs text-slate-400">Require informed consent for data collection and processing</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Biometric Authentication Lock</p>
                <ToggleSwitch enabled={settings.biometricLock} onChange={() => handleToggle('biometricLock')} />
              </div>
              <p className="text-xs text-slate-400">Fingerprint/Face ID required for sensitive data access</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 opacity-70">
              <p className="font-semibold mb-2">Data Retention Policy</p>
              <p className="text-xs text-slate-400 mb-2">Patient records retained for 5 years per MOH regulations</p>
              <p className="text-xs text-slate-300">Automatic purge of archived records after retention period</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 opacity-70">
              <p className="font-semibold mb-2">Audit & Compliance Logs</p>
              <p className="text-xs text-slate-400 mb-2">All data access events logged for compliance verification</p>
              <p className="text-xs text-slate-300">Available for MOH and ICT Authority audits</p>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
              <p className="text-xs text-blue-300">
                <span className="font-bold">Your Rights:</span> You have the right to access, correct, or delete your data. Submit requests to compliance@chpassistant.ke
              </p>
            </div>
          </div>
        </div>

        {/* AI Protocol & Language */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-amber-400" size={24} />
            <h2 className="text-2xl font-bold">Regional AI Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-2">Diagnostic Protocol</p>
              <select 
                value={settings.protocolType}
                onChange={(e) => handleInputChange('protocolType', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="MOH">Ministry of Health (MOH)</option>
                <option value="WHO">World Health Organization (WHO)</option>
              </select>
            </div>
            
            <div>
              <p className="text-slate-400 text-sm mb-2">Interface Language</p>
              <select 
                value={settings.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
                <option value="ki">Kikuyu</option>
                <option value="lu">Luhya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Configuration */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-red-400" size={24} />
            <h2 className="text-2xl font-bold">Emergency Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm mb-2">Emergency Dispatch Number</p>
              <input 
                type="tel"
                value={settings.emergencyNumber}
                onChange={(e) => handleInputChange('emergencyNumber', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <p className="text-slate-400 text-sm mb-2">Primary Facility for Referrals</p>
              <select 
                value={settings.primaryFacility}
                onChange={(e) => handleInputChange('primaryFacility', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded px-3 py-2 text-sm"
              >
                <option>Kenyatta National Hospital</option>
                <option>Nairobi Hospital</option>
                <option>Coast General Hospital</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold py-3 rounded-lg hover:shadow-lg transition">
            Save Settings
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
