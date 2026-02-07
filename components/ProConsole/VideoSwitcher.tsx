
import React from 'react';
import { CameraSource, TransitionType } from '../../types';
import { csl } from '../../services/ControlSurfaceEngine';
import { Scissors, Ghost, Play } from 'lucide-react';

interface Props {
  cameras: CameraSource[];
  programId: string;
  previewId: string;
}

const VideoSwitcher: React.FC<Props> = ({ cameras, programId, previewId }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 p-2 gap-4">
      
      {/* 🔴 PGM BUS (Bus de Aire) */}
      <div className="flex flex-col gap-1">
        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest ml-1">Program Bus (Aire)</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {cameras.map(cam => (
            <button 
              key={cam.id}
              onClick={() => csl.emit('SELECT_PGM', cam.id)}
              className={`min-w-[70px] h-12 rounded border-t-2 transition-all font-black text-[10px] uppercase italic ${programId === cam.id ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-900/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              {cam.id.replace('cam-', 'C')}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 PVW BUS (Bus de Previo) */}
      <div className="flex flex-col gap-1">
        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest ml-1">Preview Bus (Siguiente)</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {cameras.map(cam => (
            <button 
              key={cam.id}
              onClick={() => csl.emit('SELECT_PVW', cam.id)}
              className={`min-w-[70px] h-12 rounded border-t-2 transition-all font-black text-[10px] uppercase italic ${previewId === cam.id ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-900/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              {cam.id.replace('cam-', 'C')}
            </button>
          ))}
        </div>
      </div>

      {/* ⚡ TRANSITION MASTER */}
      <div className="flex-1 flex gap-3 mt-2">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <button 
            onClick={() => csl.emit('CUT')}
            className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border-b-4 border-zinc-900"
          >
            <Scissors className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Cut</span>
          </button>
          <button 
             onClick={() => csl.emit('AUTO', { transition: 'FADE' })}
             className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border-b-4 border-zinc-900"
          >
            <Ghost className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Auto</span>
          </button>
        </div>

        {/* T-BAR VIRTUAL (Touch Area) */}
        <div className="w-16 bg-zinc-900 rounded-xl border border-zinc-800 relative flex items-center justify-center group overflow-hidden">
           <div className="absolute inset-x-0 bottom-0 bg-blue-600/20 h-1/2"></div>
           <div className="text-[8px] font-black uppercase text-zinc-600 rotate-90 whitespace-nowrap">Transition Master</div>
           <div className="w-full h-8 bg-zinc-800 border-y border-zinc-700 absolute top-1/4 shadow-xl z-10 flex items-center justify-center">
              <div className="w-8 h-1 bg-zinc-600 rounded"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSwitcher;
