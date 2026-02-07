
import React from 'react';
import { CameraSource } from '../types';
import { Mic, MicOff, Link2, Link2Off, SlidersHorizontal } from 'lucide-react';

interface Props {
  cameras: CameraSource[];
}

const AudioMatrix: React.FC<Props> = ({ cameras }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2">
          <SlidersHorizontal className="w-3 h-3 text-pink-500" /> Digital Mix Desk
        </h3>
        <span className="text-[9px] text-zinc-600 font-mono">48kHz / 32-bit Float</span>
      </div>

      <div className="space-y-2">
        {/* Main Master Bus */}
        <div className="bg-black p-3 rounded-xl border border-zinc-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-pink-500 uppercase">Master Bus PGM</span>
            <span className="text-[10px] text-zinc-500 font-mono">-3.2 dB</span>
          </div>
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div className="h-full bg-green-500" style={{width: '75%'}}></div>
            <div className="h-full bg-green-900" style={{width: '25%'}}></div>
          </div>
        </div>

        {/* Canales Individuales */}
        {cameras.map(cam => (
          <div key={cam.id} className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[120px]">{cam.name}</span>
              </div>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500"><Link2Off className="w-3 h-3" /></button>
                <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500"><MicOff className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{width: '60%'}}></div>
              </div>
              <span className="text-[9px] font-mono text-zinc-600">60%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-zinc-800/30 p-3 rounded border border-zinc-800 text-[10px] text-zinc-500 text-center uppercase tracking-widest">
         Mic Master Lock Activo 🔒
      </div>
    </div>
  );
};

export default AudioMatrix;
