
import React from 'react';
import { Globe, Youtube, Facebook, Activity, Disc } from 'lucide-react';

interface Props {
  isLive: boolean;
}

const MultiStreamStatus: React.FC<Props> = ({ isLive }) => {
  const platforms = [
    { name: 'YouTube', icon: Youtube, color: 'text-red-500', status: isLive ? 'LIVE' : 'IDLE', bitrate: '6.2M' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-500', status: isLive ? 'LIVE' : 'IDLE', bitrate: '4.0M' },
    { name: 'TikTok', icon: Disc, color: 'text-cyan-400', status: isLive ? 'LIVE' : 'IDLE', bitrate: '3.5M' },
  ];

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
          <Globe className="w-3 h-3" /> Salidas RTMP
        </span>
        {isLive && <span className="text-[9px] text-green-500 animate-pulse font-bold">STABLE</span>}
      </div>
      
      <div className="space-y-1.5 mt-1">
        {platforms.map(p => (
          <div key={p.name} className="flex items-center justify-between bg-zinc-950/50 p-1.5 rounded border border-zinc-800/50">
            <div className="flex items-center gap-2">
              <p.icon className={`w-3.5 h-3.5 ${p.color}`} />
              <span className="text-[10px] font-bold text-zinc-400">{p.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-zinc-600">{isLive ? p.bitrate : '--'}</span>
              <span className={`text-[9px] font-black ${p.status === 'LIVE' ? 'text-green-500' : 'text-zinc-700'}`}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiStreamStatus;
