
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SubdomainList from './pages/SubdomainList';
import Brainstormer from './pages/Brainstormer';
import BrandStudio from './pages/BrandStudio';
import SupportBot from './pages/SupportBot';
import SettingsPage from './pages/SettingsPage';
import { Subdomain, CloudflareConfig } from './types';
import { fetchDnsRecords, createDnsRecord, deleteDnsRecord } from './services/cloudflareService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConfig = (): CloudflareConfig | null => {
    const stored = localStorage.getItem('cf_config');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const refreshSubdomains = useCallback(async () => {
    const config = getConfig();
    if (!config || !config.apiKey) return;

    setLoading(true);
    try {
      const records = await fetchDnsRecords(config);
      setSubdomains(records);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubdomains();
  }, [refreshSubdomains]);

  const handleAddSubdomain = async (sub: Omit<Subdomain, 'id' | 'createdAt' | 'status'>) => {
    const config = getConfig();
    if (!config || !config.apiKey) {
      alert("Please configure your Cloudflare API key in Settings first!");
      setActiveTab('settings');
      return;
    }

    try {
      setLoading(true);
      const newSub = await createDnsRecord(config, sub);
      setSubdomains(prev => [newSub, ...prev]);
      setActiveTab('subdomains');
    } catch (err: any) {
      alert(`Cloudflare Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubdomain = async (id: string) => {
    const config = getConfig();
    if (!config) return;

    if (!confirm("Are you sure you want to delete this DNS record?")) return;

    try {
      setLoading(true);
      await deleteDnsRecord(config, id);
      setSubdomains(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(`Cloudflare Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard subdomains={subdomains} onAddClick={() => setActiveTab('brainstorm')} />;
      case 'subdomains':
        return (
          <SubdomainList 
            subdomains={subdomains} 
            onDelete={handleDeleteSubdomain} 
          />
        );
      case 'brainstorm':
        return <Brainstormer onSelect={handleAddSubdomain} />;
      case 'branding':
        return <BrandStudio />;
      case 'support':
        return <SupportBot />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard subdomains={subdomains} onAddClick={() => setActiveTab('brainstorm')} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-between">
          <p className="text-red-400 text-sm"><strong>API Error:</strong> {error}</p>
          <button onClick={refreshSubdomains} className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg">Retry Sync</button>
        </div>
      )}
      {loading && activeTab !== 'support' && activeTab !== 'branding' && (
        <div className="fixed top-8 right-8 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider">Cloud Syncing...</span>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
