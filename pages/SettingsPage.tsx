
import React, { useState, useEffect } from 'react';
import { Cloud, Lock, Mail, Server, Save, CheckCircle } from 'lucide-react';
import { CloudflareConfig } from '../types';

const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<CloudflareConfig>({
    apiKey: '',
    email: '',
    zoneId: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cf_config');
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored config");
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cf_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Reload to trigger App.tsx update
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Configuration</h2>
        <p className="text-gray-400 mt-1">Connect your Cloudflare account to enable automated DNS management.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Cloud className="text-indigo-400" size={24} />
            <h3 className="text-xl font-bold text-white">Cloudflare API</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full bg-gray-950 border border-gray-700 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Global API Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="••••••••••••••••••••••••••••••••"
                  className="w-full bg-gray-950 border border-gray-700 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-gray-700"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Found in Cloudflare Dashboard &gt; My Profile &gt; API Tokens.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Default Zone ID</label>
              <div className="relative">
                <Server className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="text"
                  value={config.zoneId}
                  onChange={(e) => setConfig({ ...config, zoneId: e.target.value })}
                  placeholder="883a2d... (Found on CF Overview)"
                  className="w-full bg-gray-950 border border-gray-700 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${
              saved ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500'
            } text-white`}
          >
            {saved ? <CheckCircle size={20} /> : <Save size={20} />}
            {saved ? 'Credentials Saved!' : 'Save Cloudflare Credentials'}
          </button>
        </section>

        <section className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 border-dashed">
          <h3 className="text-lg font-bold text-white mb-4">Real Functionality Note</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            The app is configured to hit the Cloudflare API directly. If you experience CORS errors, you must use a proxy or run this app in a managed environment where CORS is bypassed.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
