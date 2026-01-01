
import React, { useState, useEffect } from 'react';
import { LeadData, MarketInsight, PropertyType } from './types';
import LeadForm from './components/LeadForm';
import MarketChart from './components/MarketChart';
import DubaiMap from './components/DubaiMap';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [marketStats, setMarketStats] = useState<MarketInsight[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketStats = async () => {
      const stats = await geminiService.getMarketSummary();
      setMarketStats(stats);
      if (stats.length > 0) setSelectedId(stats[0].id);
    };
    fetchMarketStats();
  }, []);

  const handleLeadSubmit = async (data: LeadData) => {
    setIsSubmitting(true);
    const [resultStrategy] = await Promise.all([
      geminiService.getInvestmentStrategy(data),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    
    setStrategy(resultStrategy);
    setIsSubmitting(false);
    setIsSuccess(true);
    console.log("Lead captured for Realty UAE Portfolio:", data);
  };

  const selectedDistrict = marketStats.find(d => d.id === selectedId);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 gradient-overlay"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          <div className="text-white space-y-8">
            <div className="inline-block px-4 py-1.5 bg-amber-600/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
              Realty UAE .ae
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Master the <br/>
              <span className="text-amber-500">UAE Portfolio.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
              Premium 
              <span className="text-white font-semibold"> Apartments, Luxury Villas, Townhouses, Communities </span>
              and 
              <span className="text-white font-semibold"> Strategic Land. </span>
              Unlock off-market assets with 8-12% annual returns.
            </p>
            
            <div className="flex flex-wrap gap-4 lg:gap-8 py-4">
              {Object.values(PropertyType).map((type, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            {!isSuccess ? (
              <LeadForm onSubmit={handleLeadSubmit} isSubmitting={isSubmitting} />
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-t-4 border-amber-500 animate-fadeIn">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">Strategy Ready</h3>
                <p className="text-slate-500 text-center mb-6 text-sm">
                  Our advisors have been notified and will reach out via <span className="font-bold text-slate-900">info@realtyuae.ae</span>
                </p>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                  <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3 text-center">Your Investment Roadmap</h4>
                  <div className="text-sm text-slate-700 leading-relaxed italic prose prose-slate max-h-48 overflow-y-auto">
                    {strategy || 'Preparing your custom report...'}
                  </div>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="w-full mt-6 text-slate-400 text-xs font-bold hover:text-amber-600 transition-colors uppercase tracking-widest"
                >
                  New Analysis Request
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Market Intelligence Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Market Intelligence</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Click on the interactive map below to explore specialized performance metrics for Apartments, Villas, and Land.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <DubaiMap 
              districts={marketStats} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
            />

            <div className="space-y-6">
              {selectedDistrict ? (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-fadeIn">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedDistrict.area}</h3>
                      <p className="text-slate-500 text-sm italic">{selectedDistrict.description}</p>
                    </div>
                    <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-black text-xl">
                      {selectedDistrict.roi}% ROI
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Entry Price</span>
                      <span className="text-lg font-bold text-slate-800">{selectedDistrict.avgPrice}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Market Trend</span>
                      <span className={`text-lg font-bold ${selectedDistrict.trend === 'up' ? 'text-green-600' : 'text-slate-600'}`}>
                        {selectedDistrict.trend === 'up' ? '↑ Rising' : '→ Stable'}
                      </span>
                    </div>
                  </div>

                  <MarketChart highlightArea={selectedDistrict.area} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                  Select a district on the map to view data
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {marketStats.map((stat) => (
                  <button
                    key={stat.id}
                    onClick={() => setSelectedId(stat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      selectedId === stat.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-500 hover:text-amber-600'
                    }`}
                  >
                    {stat.area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div className="space-y-3">
              <div className="text-amber-500 mb-4 inline-block">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <h4 className="font-bold text-lg">Secure Assets</h4>
              <p className="text-slate-400 text-sm">Escrow-backed transactions for all Property & Land types.</p>
            </div>
            <div className="space-y-3">
              <div className="text-amber-500 mb-4 inline-block">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
              </div>
              <h4 className="font-bold text-lg">Market Growth</h4>
              <p className="text-slate-400 text-sm">Capital appreciation of up to 25% in high-demand Communities.</p>
            </div>
            <div className="space-y-3">
              <div className="text-amber-500 mb-4 inline-block">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              </div>
              <h4 className="font-bold text-lg">Guided Tours</h4>
              <p className="text-slate-400 text-sm">Private property inspections for Villas and Apartments.</p>
            </div>
            <div className="space-y-3">
              <div className="text-amber-500 mb-4 inline-block">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" /></svg>
              </div>
              <h4 className="font-bold text-lg">Expert Advisory</h4>
              <p className="text-slate-400 text-sm">Strategic consultation for Land development & investments.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-16 text-slate-500 text-xs border-t border-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 items-center text-center md:text-left">
            <div>
              <p className="text-slate-100 font-black uppercase tracking-[0.3em] text-lg mb-2">Realty UAE .ae</p>
              <p className="max-w-xs mx-auto md:mx-0">Premium real estate investment brokerage specializing in the UAE market since 2024.</p>
            </div>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@realtyuae.ae" className="text-amber-500 font-bold text-base hover:text-amber-400 transition-colors">info@realtyuae.ae</a>
              <p>Registered Brokerage License #129384/UAE</p>
            </div>
            <div className="flex justify-center md:justify-end gap-6 uppercase font-bold tracking-widest text-[10px]">
              <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-amber-500 transition-colors text-slate-300 border-b border-slate-700">Brokerage License</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-900 text-center text-slate-600">
            <p>© 2024 Realty UAE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
