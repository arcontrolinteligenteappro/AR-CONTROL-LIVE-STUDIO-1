
import React from 'react';
import { AudioChannel } from '../../types';
import { csl } from '../../services/ControlSurfaceEngine';
import { Lock, Unlock, Mic, MicOff, Zap } from 'lucide-react';

interface Props {
  channel: AudioChannel;
  isPro?: boolean;
}

const AudioStrip: React.FC<Props> = ({ channel, isPro = true }) => {
  return (
    <div className={`w-16 h-full flex flex-col items-center bg-zinc-900 border-x border-zinc-800 py-2 transition-all ${channel.isLocked ? 'bg-blue-900/10 ring-1 ring-inset ring-blue-500/20' : ''}`}>
      
      {/* Preamps / Gain Trim (PRO Only) */}
      {isPro && (
        <div className="mb-2 flex flex-col items-center">
           <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:border-cyan-500">
             <div className="w-0.5 h-2 bg-zinc-600 rotate-45"></div>
           </div>
           <span className="text-[6px] font-bold text-zinc-600 mt-1 uppercase">Trim</span>
        </div>
      )}

      {/* Mic Lock Button */}
      <button 
        onClick={() => csl.emit('AUDIO_TOGGLE_LOCK', channel.id)}
        className={`p-1 rounded-full mb-1 transition-all ${channel.isLocked ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        {channel.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
      </button>

      {/* VU Meter Bridge (Professional Vertical Style) */}
      <div className="w-3 h-32 bg-black rounded-sm overflow-hidden flex flex-col justify-end border border-zinc-800 p-0.5 relative">
        <div 
          className={`w-full transition-all duration-75 rounded-sm ${channel.meter > 90 ? 'bg-red-500 shadow-[0_0_8px_red]' : channel.meter > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ height: `${channel.isMuted ? 0 : channel.meter}%` }}
        />
        {/* Scales */}
        <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-10 pointer-events-none">
            {[...Array(6)].map((_, i) => <div key={i} className="h-px w-full bg-white" />)}
        </div>
      </div>

      {/* Fader Track */}
      <div className="flex-1 w-full flex flex-col items-center py-4 relative group/fader">
        <div className="absolute inset-y-4 w-1 bg-black rounded-full shadow-inner border border-zinc-800/50"></div>
        <input 
          type="range"
          min="0" max="100"
          value={channel.volume}
          onChange={(e) => csl.emit('AUDIO_SET_GAIN', { id: channel.id, val: parseInt(e.target.value) })}
          disabled={channel.isLocked}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]"
        />
        {/* Professional Fader Cap */}
        <div 
          className={`w-10 h-5 bg-gradient-to-b from-zinc-200 to-zinc-400 rounded shadow-2xl border-x border-zinc-500 z-10 pointer-events-none absolute flex items-center justify-center ${channel.isLocked ? 'opacity-50 grayscale' : ''}`}
          style={{ bottom: `${channel.volume}%`, transform: 'translateY(50%)' }}
        >
          <div className="h-px w-full bg-zinc-600"></div>
          {channel.isLocked && <Lock className="w-2.5 h-2.5 text-blue-900 absolute" />}
        </div>
      </div>

      {/* Channel Actions */}
      <div className="flex flex-col gap-2 mt-auto pb-1">
        {isPro && (
            <div className="flex gap-1 mb-1">
                <button className="w-6 h-6 bg-zinc-800 rounded-md text-[7px] font-black text-zinc-500 hover:text-white border border-zinc-700">SOLO</button>
                <button className={`w-6 h-6 bg-zinc-800 rounded-md text-[7px] font-black border border-zinc-700 ${channel.afv ? 'text-orange-500 border-orange-500/50 bg-orange-950/20' : 'text-zinc-500'}`}>AFV</button>
            </div>
        )}
        <button 
          onClick={() => csl.emit('AUDIO_TOGGLE_MUTE', channel.id)}
          disabled={channel.isLocked}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${channel.isMuted ? 'bg-red-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700'}`}
        >
          {channel.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      <span className="text-[7px] font-black text-zinc-600 uppercase mt-2 truncate w-full text-center px-1">
        {channel.label}
      </span>
    </div>
  );
};

export default AudioStrip;
