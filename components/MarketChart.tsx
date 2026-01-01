
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Business Bay', roi: 9.2 },
  { name: 'Palm Jumeirah', roi: 10.5 },
  { name: 'Dubai Hills', roi: 8.2 },
  { name: 'Dubai Marina', roi: 8.8 },
  { name: 'JVC', roi: 11.4 },
];

interface MarketChartProps {
  highlightArea?: string;
}

const MarketChart: React.FC<MarketChartProps> = ({ highlightArea }) => {
  return (
    <div className="h-[200px] w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comparative ROI Analysis (%)</h4>
        <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Target: 8-12%</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 8, fill: '#94a3b8' }} 
          />
          <YAxis 
            domain={[0, 14]}
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 8, fill: '#94a3b8' }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
          />
          <Bar dataKey="roi" radius={[2, 2, 0, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.name === highlightArea ? '#d97706' : '#94a3b8'} 
                fillOpacity={entry.name === highlightArea ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;
