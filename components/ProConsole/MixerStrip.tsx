
import React from 'react';
import { AudioChannel } from '../../types';
import { csl } from '../../services/ControlSurfaceEngine';
import { Lock, Unlock, Mic, MicOff, Link2 } from 'lucide-react';

interface Props {
  channel: AudioChannel;
}

const MixerStrip: React.FC<Props> = ({ channel }) => {
  return (
    <div className={`w-14 h-full bg-zinc-900 border-x border-zinc-800 flex flex-col items-center py-2 group transition-all ${channel.isLocked ? 'bg-blue-900/10 ring-1 ring-inset ring-blue-500/20' : ''}`}>
      
      {/* Mic Lock Button */}
      <button 
        onClick={() => csl.emit('AUDIO_TOGGLE_LOCK', channel.id)}
        className={`p-1 rounded-full mb-2 transition-all ${channel.isLocked ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        {channel.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
      </button>

      {/* Meter Bridge */}
      <div className="w-2 h-24 bg-black rounded-full overflow-hidden flex flex-col justify-end border border-zinc-800 relative">
        <div 
          className={`w-full transition-all duration-75 ${channel.meter > 90 ? 'bg-red-500' : channel.meter > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ height: `${channel.isMuted ? 0 : channel.meter}%` }}
        />
        {/* dB markers */}
        <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-20 pointer-events-none">
          {[...Array(5)].map((_, i) => <div key={i} className="h-px w-full bg-white" />)}
        </div>
      </div>

      {/* Fader Track */}
      <div className="flex-1 w-full flex flex-col items-center py-4 relative group/fader">
        <div className="absolute inset-y-4 w-1 bg-black rounded-full shadow-inner"></div>
        <input 
          type="range"
          min="0" max="100"
          value={channel.volume}
          onChange={(e) => csl.emit('AUDIO_SET_GAIN', { id: channel.id, val: parseInt(e.target.value) })}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]"
        />
        {/* Visual Fader Cap */}
        <div 
          className="w-8 h-4 bg-zinc-200 rounded shadow-2xl border-x border-zinc-400 z-10 pointer-events-none absolute"
          style={{ bottom: `${channel.volume}%`, transform: 'translateY(50%)' }}
        >
          <div className="h-px w-full bg-zinc-400 mt-2"></div>
        </div>
      </div>

      {/* Channel Controls */}
      <div className="flex flex-col gap-2 mt-auto">
        <button 
          onClick={() => csl.emit('AUDIO_TOGGLE_AFV', channel.id)}
          className={`p-1.5 rounded transition-all ${channel.afv ? 'bg-orange-600/20 text-orange-500' : 'text-zinc-700 hover:text-zinc-500'}`}
          title="Audio Follow Video"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => csl.emit('AUDIO_TOGGLE_MUTE', channel.id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${channel.isMuted ? 'bg-red-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
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

export default MixerStrip;
