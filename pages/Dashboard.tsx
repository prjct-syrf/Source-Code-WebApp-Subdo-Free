
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Subdomain } from '../types';
import { Activity, Globe, Plus, Zap, AlertCircle } from 'lucide-react';

const data = [
  { name: 'Mon', queries: 4000 },
  { name: 'Tue', queries: 3000 },
  { name: 'Wed', queries: 2000 },
  { name: 'Thu', queries: 2780 },
  { name: 'Fri', queries: 1890 },
  { name: 'Sat', queries: 2390 },
  { name: 'Sun', queries: 3490 },
];

interface DashboardProps {
  subdomains: Subdomain[];
  onAddClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ subdomains, onAddClick }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Cloud Overview</h2>
          <p className="text-gray-400 mt-1">Real-time performance metrics for your connected domains.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          Create Subdomain
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Domains', value: subdomains.length, icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Total Queries', value: '1.2M', icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Avg Latency', value: '24ms', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'DDoS Blocks', value: '412', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Traffic Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#6366f1" fillOpacity={1} fill="url(#colorQueries)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Record Types</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'A', value: 12 }, { name: 'CNAME', value: 8 }, { name: 'AAAA', value: 4 }, { name: 'TXT', value: 15 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
