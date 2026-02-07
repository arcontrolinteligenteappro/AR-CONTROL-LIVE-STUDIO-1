
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StreamStats } from '../types';

interface StreamMonitorProps {
  data: StreamStats[];
  color: string;
  label: string;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ data, color, label }) => {
  // Transform StreamStats array into something rechart can use directly if needed,
  // but assuming data is passed in a way conducive to history.
  // We'll map the recent stats history.
  
  return (
    <div className="h-24 w-full bg-zinc-900/50 rounded-lg border border-zinc-800 p-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-mono text-zinc-400 uppercase">{label}</span>
        <span className="text-xs font-bold text-zinc-200">
           {data.length > 0 ? data[data.length - 1].bitrate.toFixed(1) : 0} Mbps
        </span>
      </div>
      <ResponsiveContainer width="100%" height="70%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
          <XAxis dataKey="timestamp" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', fontSize: '12px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => [value.toFixed(2), label]}
            labelStyle={{ display: 'none' }}
          />
          <Area 
            type="monotone" 
            dataKey="bitrate" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#color${label})`} 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StreamMonitor;
