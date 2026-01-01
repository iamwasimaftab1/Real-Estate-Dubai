
import React from 'react';
import { MarketInsight } from '../types';

interface DubaiMapProps {
  districts: MarketInsight[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const DubaiMap: React.FC<DubaiMapProps> = ({ districts, selectedId, onSelect }) => {
  return (
    <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
      {/* Stylized Coastline Background */}
      <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <path 
          d="M0,400 Q150,380 300,420 T600,350 T800,380 L800,500 L0,500 Z" 
          fill="url(#water-gradient)" 
        />
        <defs>
          <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      {/* Map Markers */}
      <div className="absolute inset-0 p-8">
        {districts.map((district) => (
          <button
            key={district.id}
            onClick={() => onSelect(district.id)}
            style={{ 
              left: `${district.coordinates.x}%`, 
              top: `${district.coordinates.y}%` 
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group/marker ${
              selectedId === district.id ? 'z-30' : 'z-10'
            }`}
          >
            {/* Pulse Effect */}
            <div className={`absolute inset-0 rounded-full animate-ping bg-amber-500/40 ${
              selectedId === district.id ? 'block' : 'hidden group-hover/marker:block'
            }`}></div>
            
            {/* Main Point */}
            <div className={`relative w-4 h-4 rounded-full border-2 transition-transform duration-300 ${
              selectedId === district.id 
                ? 'bg-amber-500 border-white scale-125 shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
                : 'bg-slate-800 border-amber-500/50 hover:scale-110'
            }`}></div>

            {/* Label */}
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter transition-all duration-300 ${
              selectedId === district.id
                ? 'bg-amber-500 text-white translate-y-0 opacity-100 shadow-lg'
                : 'bg-slate-900/80 text-slate-400 -translate-y-1 opacity-0 group-hover/marker:opacity-100 group-hover/marker:translate-y-0 border border-slate-700'
            }`}>
              {district.area.toUpperCase()}
            </div>
          </button>
        ))}
      </div>

      {/* Map Legend/Overlay */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Interactive Investment Map</h5>
        <p className="text-[9px] text-slate-600">Click markers to explore ROI potential</p>
      </div>

      {/* Selected Indicator HUD */}
      {selectedId && (
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 p-3 rounded-lg animate-fadeIn">
          <div className="text-[10px] text-amber-500 font-bold uppercase mb-1">Live Zone Status</div>
          <div className="text-white text-sm font-bold">
            {districts.find(d => d.id === selectedId)?.area}
          </div>
        </div>
      )}
    </div>
  );
};

export default DubaiMap;
