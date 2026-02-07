
import React from 'react';
import { CameraSource, ScoreboardState, SportType } from '../types';
import { Scissors, Mic, Rewind, Trophy, ShoppingCart, Volume2, UserCheck, Flag, Zap } from 'lucide-react';

interface Props {
  programCam: CameraSource;
  previewCam: CameraSource;
  onTake: () => void;
  scoreboard: ScoreboardState;
  isLive: boolean;
}

const DirectorConsole: React.FC<Props> = ({ programCam, previewCam, onTake, scoreboard, isLive }) => {
  return (
    <div className="absolute inset-0 flex flex-col p-2 gap-2 bg-zinc-950 animate-in fade-in zoom-in-95 duration-500">
      
      {/* 📺 MONITOR DE PROGRAMA DOMINANTE (PGM) */}
      <div className="flex-[3] relative bg-black rounded-3xl overflow-hidden border-2 border-zinc-900 shadow-2xl ring-4 ring-black/50">
        <img src={programCam.thumbnailUrl} className="w-full h-full object-cover" alt="PGM" />
        
        {/* Tally & Metadata Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
          <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-xl border-t ${isLive ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_white]"></span>
            {isLive ? 'PROGRAMA AL AIRE' : 'CONTROL DIRECTOR - STANDBY'}
          </div>
          <div className="bg-black/60 backdrop-blur-xl px-3 py-1 rounded-lg text-white font-mono text-[9px] border border-white/5 uppercase tracking-widest">
            {programCam.name} • {programCam.stats.bitrate} Mbps • {programCam.protocol}
          </div>
        </div>

        {/* Marcador Broadcast Real-time */}
        {scoreboard.isVisible && (
          <div className="absolute top-4 right-4 animate-in slide-in-from-right duration-500">
            <div className="flex bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 p-1.5 rounded-2xl shadow-2xl min-w-[220px] overflow-hidden">
               <div className="flex-1 flex flex-col items-center justify-center text-white px-3 border-r border-zinc-800">
                <span className="text-[7px] font-black uppercase text-zinc-500 tracking-widest">{scoreboard.homeName}</span>
                <span className="text-3xl font-black italic">{scoreboard.homeScore}</span>
              </div>
              <div className="bg-zinc-900/50 px-4 flex flex-col items-center justify-center font-mono font-bold">
                <div className="text-blue-500 text-xs">{scoreboard.timer}</div>
                <div className="text-[7px] text-zinc-600 uppercase">Per {scoreboard.period}</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-white px-3 border-l border-zinc-800">
                <span className="text-[7px] font-black uppercase text-zinc-500 tracking-widest">{scoreboard.awayName}</span>
                <span className="text-3xl font-black italic">{scoreboard.awayScore}</span>
              </div>
            </div>
          </div>
        )}

        {/* 🎥 PREVIEW FLOTANTE TACTICAL (Next Up) */}
        <div 
          onClick={onTake}
          className="absolute bottom-4 right-4 w-48 aspect-video bg-zinc-900 rounded-2xl border-4 border-green-600/60 overflow-hidden shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all z-20 group"
        >
          <img src={previewCam.thumbnailUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="PVW" />
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-0.5 text-[8px] font-black uppercase rounded-lg shadow-lg">SIGUIENTE: {previewCam.name}</div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
             <Scissors className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* 🎛️ CONTROL SURFACE: MACROS Y PINCHE DE VOLUMEN */}
      <div className="h-32 flex gap-2">
        
        {/* Macros de Deporte (Izquierda) */}
        <div className="grid grid-cols-2 gap-2 flex-1">
           <button className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-yellow-500 active:bg-yellow-950 transition-all group">
              <Trophy className="w-6 h-6 group-hover:scale-125 transition-transform" />
              <span className="text-[8px] font-black uppercase italic tracking-tighter">¡GOL! / PUNTO</span>
           </button>
           <button className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-red-500 active:bg-red-950 transition-all group">
              <Flag className="w-6 h-6 group-hover:scale-125 transition-transform" />
              <span className="text-[8px] font-black uppercase italic tracking-tighter">FALTA / PENAL</span>
           </button>
           <button className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-blue-500 active:bg-blue-950 transition-all group">
              <UserCheck className="w-6 h-6 group-hover:scale-125 transition-transform" />
              <span className="text-[8px] font-black uppercase italic tracking-tighter">CAMBIO JUG.</span>
           </button>
           <button className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-purple-500 active:bg-purple-950 transition-all group">
              <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />
              <span className="text-[8px] font-black uppercase italic tracking-tighter">SLO-MO REPLAY</span>
           </button>
        </div>

        {/* Switcher Táctil (Centro) */}
        <button onClick={onTake} className="w-40 bg-red-600 rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-90 transition-all shadow-2xl border-t border-red-400 active:bg-red-800">
          <Scissors className="w-10 h-10 text-white" />
          <span className="text-[10px] font-black text-white uppercase italic tracking-widest">TAKE</span>
        </button>

        {/* Pinche de Volumen Independiente (Derecha) */}
        <div className="w-24 bg-zinc-900 border border-zinc-800 rounded-3xl p-3 flex flex-col items-center relative overflow-hidden group">
           <Volume2 className="w-5 h-5 text-blue-500 mb-2" />
           <div className="flex-1 w-full bg-black/40 rounded-2xl overflow-hidden flex flex-col justify-end p-1 border border-zinc-800">
              <div className="w-full bg-blue-600 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{height: '80%'}}></div>
           </div>
           <span className="text-[8px] font-black text-zinc-500 mt-2 uppercase">Audio PGM</span>
           <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default DirectorConsole;
