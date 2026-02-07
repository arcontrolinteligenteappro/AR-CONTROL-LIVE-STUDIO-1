
import React from 'react';
import { CameraSource, ScoreboardState } from '../types';

interface Props {
  cameras: CameraSource[];
  programId: string;
  previewId: string;
  onSelectPreview: (id: string) => void;
  onTake: () => void;
  scoreboard: ScoreboardState;
}

const StudioMultiview: React.FC<Props> = ({ cameras, programId, previewId, onSelectPreview, onTake, scoreboard }) => {
  return (
    <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 bg-black">
      {/* 🔴 MONITOR PROGRAMA (PGM) */}
      <div className="col-span-2 row-span-2 relative bg-zinc-900 border-4 border-red-600 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)]">
         <img src={cameras.find(c => c.id === programId)?.thumbnailUrl} className="w-full h-full object-cover" />
         <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 text-xs font-black uppercase tracking-widest shadow-lg">PROGRAMA</div>
         
         {/* Overlay de Marcador Real-time */}
         {scoreboard.isVisible && (
           <div className="absolute top-10 left-10 scale-150 origin-top-left bg-zinc-950/80 backdrop-blur-md p-2 rounded border border-zinc-800 shadow-2xl">
              <div className="flex items-center gap-3 font-black text-white">
                <span className="text-blue-500">{scoreboard.homeName}</span>
                <span className="bg-zinc-900 px-2 rounded">{scoreboard.homeScore} - {scoreboard.awayScore}</span>
                <span className="text-red-500">{scoreboard.awayName}</span>
              </div>
           </div>
         )}
      </div>

      {/* 🟢 MONITOR PREVIEW (PVW) */}
      <div className="col-span-2 row-span-2 relative bg-zinc-900 border-4 border-green-600 overflow-hidden" onClick={onTake}>
         <img src={cameras.find(c => c.id === previewId)?.thumbnailUrl} className="w-full h-full object-cover opacity-70" />
         <div className="absolute top-0 left-0 bg-green-600 text-white px-4 py-1 text-xs font-black uppercase tracking-widest shadow-lg">PREVIEW</div>
         <div className="absolute bottom-4 right-4 animate-pulse">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full border border-white/10 uppercase">Click para Cambiar</span>
         </div>
      </div>

      {/* 📸 FUENTES INDIVIDUALES */}
      {cameras.map((cam, idx) => (
        <div 
          key={cam.id} 
          onClick={() => onSelectPreview(cam.id)}
          className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
            programId === cam.id ? 'border-red-600 ring-4 ring-red-600/20' : 
            previewId === cam.id ? 'border-green-500 shadow-lg' : 'border-zinc-800 opacity-60 hover:opacity-100'
          }`}
        >
          <img src={cam.thumbnailUrl} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/60 backdrop-blur-md flex items-center justify-between">
            <span className="text-[10px] font-bold text-white uppercase italic">{idx + 1}. {cam.name}</span>
            <div className={`w-2 h-2 rounded-full ${cam.status === 'CONECTADO' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
          </div>
          {programId === cam.id && <div className="absolute inset-0 bg-red-600/10 pointer-events-none"></div>}
        </div>
      ))}
    </div>
  );
};

export default StudioMultiview;
