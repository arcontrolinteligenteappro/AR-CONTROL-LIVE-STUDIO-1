
import React from 'react';
import { CameraSource } from '../../types';
import { csl } from '../../services/ControlSurfaceEngine';
import { Scissors, Ghost, Play } from 'lucide-react';

interface Props {
  cameras: CameraSource[];
  programId: string;
  previewId: string;
}

const SwitcherPanel: React.FC<Props> = ({ cameras, programId, previewId }) => {
  return (
    <div className="flex flex-col gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Video Switcher (Bus A/B)</span>
        <div className="flex gap-2">
           <div className="flex bg-black rounded p-0.5 border border-zinc-800">
              <button className="px-2 py-0.5 text-[8px] font-bold bg-zinc-800 rounded">Mix</button>
              <button className="px-2 py-0.5 text-[8px] font-bold text-zinc-600">Dip</button>
           </div>
        </div>
      </div>

      {/* Program Bus (Red) */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {cameras.map(cam => (
          <button
            key={`pgm-${cam.id}`}
            className={`w-14 h-10 rounded font-black text-[10px] transition-all border-t-2 ${programId === cam.id ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-900/40' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
          >
            {cam.id.replace('cam-', 'C')}
          </button>
        ))}
      </div>

      {/* Preview Bus (Green) */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {cameras.map(cam => (
          <button
            key={`pvw-${cam.id}`}
            onClick={() => csl.emit('VIDEO_SWITCH_PREVIEW', cam.id, 'P0')}
            className={`w-14 h-10 rounded font-black text-[10px] transition-all border-t-2 ${previewId === cam.id ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-900/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
          >
            {cam.id.replace('cam-', 'C')}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button 
          onClick={() => csl.emit('VIDEO_CUT', null, 'P0')}
          className="h-16 bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all rounded-xl flex flex-col items-center justify-center border-b-4 border-zinc-950"
        >
          <Scissors className="w-5 h-5 text-white" />
          <span className="text-[9px] font-black uppercase mt-1">Cut</span>
        </button>
        <button 
          onClick={() => csl.emit('VIDEO_AUTO', { type: 'FADE', ms: 500 }, 'P0')}
          className="h-16 bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all rounded-xl flex flex-col items-center justify-center border-b-4 border-zinc-950"
        >
          <Ghost className="w-5 h-5 text-zinc-400" />
          <span className="text-[9px] font-black uppercase mt-1">Auto</span>
        </button>
      </div>
    </div>
  );
};

export default SwitcherPanel;
