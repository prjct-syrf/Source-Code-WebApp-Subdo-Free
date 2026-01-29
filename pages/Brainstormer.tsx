
import React, { useState } from 'react';
import { generateSubdomainNames } from '../services/geminiService';
import { Sparkles, Loader2, Plus, ArrowRight, X, Globe, Shield, Terminal } from 'lucide-react';
import { Subdomain } from '../types';

interface BrainstormerProps {
  onSelect: (sub: Omit<Subdomain, 'id' | 'createdAt' | 'status'>) => void;
}

const Brainstormer: React.FC<BrainstormerProps> = ({ onSelect }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  
  // Selection/Config State
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState('127.0.0.1');
  const [proxied, setProxied] = useState(true);

  const handleBrainstorm = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const names = await generateSubdomainNames(prompt);
    setResults(names);
    setLoading(false);
  };

  const handleCreate = () => {
    if (!selectedName) return;
    onSelect({
      name: selectedName.toLowerCase().replace(/\s+/g, '-'),
      domain: 'yourdomain.com', // Will be overwritten by CF API result or should be dynamic
      target: ipAddress,
      type: 'A',
      proxied: proxied
    });
    setSelectedName(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-sm mb-4 border border-indigo-500/20">
          <Sparkles size={16} />
          AI Powered Brainstorming
        </div>
        <h2 className="text-4xl font-extrabold text-white">Find Your Perfect Name</h2>
        <p className="text-gray-400 mt-2 text-lg">Tell us about your project, and Gemini will suggest catchy subdomain names.</p>
      </header>

      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A minimalist personal blog about photography and travels"
            className="flex-1 bg-gray-950 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-gray-600"
            onKeyDown={(e) => e.key === 'Enter' && handleBrainstorm()}
          />
          <button
            onClick={handleBrainstorm}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all min-w-[180px]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? 'Thinking...' : 'Brainstorm'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {results.map((name, i) => (
            <div 
              key={i} 
              className="group bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer"
              onClick={() => setSelectedName(name)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-white font-mono">{name.toLowerCase()}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">
                  <Plus size={20} />
                </div>
              </div>
              <p className="text-gray-500 text-sm">Click to configure</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:gap-3 transition-all">
                SELECT NAME <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configuration Modal */}
      {selectedName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Configure DNS</h3>
                <p className="text-indigo-400 font-mono text-sm">{selectedName.toLowerCase()}.yourdomain.com</p>
              </div>
              <button onClick={() => setSelectedName(null)} className="text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Record Type</label>
                <div className="bg-gray-950 border border-gray-800 p-3 rounded-xl text-white font-bold flex items-center gap-2">
                  <Globe size={16} className="text-indigo-400" />
                  A (IPv4 Address)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target IP Address</label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-mono"
                    placeholder="e.g. 1.2.3.4"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield size={20} className={proxied ? "text-orange-500" : "text-gray-600"} />
                  <div>
                    <p className="text-sm font-bold text-white">Cloudflare Proxy</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Hide Origin IP</p>
                  </div>
                </div>
                <button 
                  onClick={() => setProxied(!proxied)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${proxied ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${proxied ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Record to Cloudflare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brainstormer;
