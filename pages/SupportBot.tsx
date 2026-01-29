
import React, { useState, useRef, useEffect } from 'react';
import { startChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Info } from 'lucide-react';

const SupportBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Hello! I'm your NebulaSub AI assistant. How can I help you manage your Cloudflare subdomains or optimize your DNS settings today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Memoized chat session
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = startChatSession(
        "You are NebulaSub Support, a world-class senior Cloudflare and DevOps engineer. " +
        "You help users with DNS, CDN caching, Page Rules, WAF, and Subdomain management. " +
        "Be technical but accessible. Keep responses concise and use markdown for code blocks."
      );
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: input });
      const modelText = result.text;
      
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: modelText || "I'm sorry, I couldn't process that. Can you rephrase?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Connection error with Gemini. Please check your API key and network.", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <header className="bg-gray-900 border border-gray-800 p-6 rounded-t-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-none">Nebula Support</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Always Online</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-wider">
          Gemini 3 Pro
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-900/50 border-x border-gray-800 p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-800'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700 shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="mt-2 text-[10px] opacity-40 uppercase font-bold tracking-widest">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-2xl rounded-tl-none text-gray-400">
                <Loader2 className="animate-spin w-5 h-5" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-b-3xl">
        <div className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything about DNS, records, or SSL..."
            className="flex-1 bg-gray-950 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-gray-600"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white px-6 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg shadow-indigo-600/10"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-3 justify-center text-[10px] text-gray-500 font-medium">
          <Info size={12} />
          AI responses may occasionally be inaccurate. Always verify DNS records.
        </div>
      </div>
    </div>
  );
};

export default SupportBot;
