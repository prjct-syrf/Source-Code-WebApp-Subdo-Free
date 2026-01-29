
import React from 'react';
import { Subdomain } from '../types';
import { Trash2, ExternalLink, Shield, Settings2, Globe } from 'lucide-react';

interface SubdomainListProps {
  subdomains: Subdomain[];
  onDelete: (id: string) => void;
}

const SubdomainList: React.FC<SubdomainListProps> = ({ subdomains, onDelete }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Cloud Assets</h2>
        <p className="text-gray-400 mt-1">Manage all your active subdomain records across your Cloudflare zones.</p>
      </header>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Hostname</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Target</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {subdomains.map((sub) => (
                <tr key={sub.id} className="group hover:bg-gray-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                        <Globe size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white">{sub.name}</div>
                        <div className="text-xs text-gray-500">{sub.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-md text-xs font-mono font-bold text-indigo-400">
                      {sub.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-mono text-gray-400 max-w-[200px] truncate">{sub.target}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Active</span>
                      {sub.proxied && (
                        <div title="Cloudflare Proxied" className="ml-1 text-orange-500">
                          <Shield size={14} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Settings2 size={18} />
                      </button>
                      <a 
                        href={`http://${sub.name}.${sub.domain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-gray-800 hover:bg-indigo-600 rounded-lg text-gray-400 hover:text-white transition-all"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => onDelete(sub.id)}
                        className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg text-gray-400 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubdomainList;
