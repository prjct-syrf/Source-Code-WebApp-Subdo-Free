
import React, { useState } from 'react';
import { generateBrandVisual, checkApiKey, openApiKeyDialog } from '../services/geminiService';
import { ImageSize } from '../types';
import { ImageIcon, Loader2, Download, Wand2, Info, AlertTriangle } from 'lucide-react';

const BrandStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.K1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check for API key before calling Gemini 3 Pro
    const hasKey = await checkApiKey();
    if (!hasKey) {
      await openApiKeyDialog();
      // After dialog, proceed (SDK handles the token injection)
    }

    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateBrandVisual(prompt, size);
      if (imageUrl) {
        setResult(imageUrl);
      } else {
        setError("Generation yielded no results. Try a different prompt.");
      }
    } catch (err: any) {
      if (err.message === "API_KEY_RESET") {
          setError("API Key session expired or invalid. Please re-select your key.");
          await openApiKeyDialog();
      } else {
          setError("An error occurred during generation. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-400 font-semibold text-sm mb-4 border border-pink-500/20">
          <ImageIcon size={16} />
          Gemini 3 Pro Image Generation
        </div>
        <h2 className="text-4xl font-extrabold text-white">Visual Identity Studio</h2>
        <p className="text-gray-400 mt-2 text-lg">Generate ultra-high resolution brand assets and logos in seconds.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Visual Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your brand's look and feel..."
              className="w-full h-40 bg-gray-950 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all placeholder:text-gray-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Image Quality (Output Size)</label>
            <div className="grid grid-cols-3 gap-3">
              {[ImageSize.K1, ImageSize.K2, ImageSize.K4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 rounded-xl font-bold transition-all border ${
                    size === s 
                      ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20' 
                      : 'bg-gray-950 border-gray-800 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500 flex items-center gap-1">
              <Info size={12} />
              4K provides maximum detail but may take longer to generate.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? 'Generating 4K Asset...' : 'Generate Brand Asset'}
          </button>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
             <p className="text-xs text-blue-400 leading-relaxed">
               <strong>Note:</strong> Gemini 3 Pro requires a personal API key from a paid GCP project. 
               <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Learn more.</a>
             </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl flex flex-col items-center justify-center p-4 relative min-h-[400px]">
          {loading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium">Painting with pixels...</p>
              <p className="text-gray-500 text-sm mt-1">Applying {size} resolution details</p>
            </div>
          ) : result ? (
            <>
              <img src={result} alt="Generated Asset" className="w-full h-full object-contain rounded-2xl shadow-2xl" />
              <div className="absolute bottom-6 right-6 flex gap-2">
                <a 
                  href={result} 
                  download="nebula-sub-brand.png"
                  className="bg-gray-950/80 backdrop-blur border border-gray-700 p-3 rounded-full text-white hover:bg-indigo-600 transition-all"
                >
                  <Download size={20} />
                </a>
              </div>
            </>
          ) : error ? (
            <div className="text-center p-8">
                <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4" />
                <p className="text-red-400 font-medium">{error}</p>
                <button onClick={handleGenerate} className="text-indigo-400 mt-2 hover:underline">Try Again</button>
            </div>
          ) : (
            <div className="text-center p-12 opacity-50">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="text-gray-600" size={40} />
              </div>
              <p className="text-gray-400 text-lg">Enter a prompt to see your brand come to life</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandStudio;
