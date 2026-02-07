
import React from 'react';
import { ScoreboardState } from '../../types';
import { csl } from '../../services/ControlSurfaceEngine';
import { Trophy, Zap, Rewind, Flag, Users, MessageCircle } from 'lucide-react';

interface Props {
  scoreboard: ScoreboardState;
}

const PerformanceDeck: React.FC<Props> = ({ scoreboard }) => {
  return (
    <div className="h-full flex flex-col gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
      <div className="flex justify-between items-center px-1">
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Performance Pad (Sports)</span>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>

      {/* Marcador Integrado */}
      <div className="bg-black/60 rounded-xl p-3 border border-zinc-800 flex items-center justify-between">
         <div className="text-center flex-1">
            <div className="text-[8px] text-zinc-500 font-bold uppercase">{scoreboard.homeName}</div>
            <div className="text-2xl font-black text-blue-500">{scoreboard.homeScore}</div>
         </div>
         <div className="px-4 text-center">
            <div className="text-[10px] font-mono text-zinc-600">{scoreboard.timer}</div>
            <div className="text-[8px] font-bold text-zinc-700">PER {scoreboard.period}</div>
         </div>
         <div className="text-center flex-1">
            <div className="text-[8px] text-zinc-500 font-bold uppercase">{scoreboard.awayName}</div>
            <div className="text-2xl font-black text-red-500">{scoreboard.awayScore}</div>
         </div>
      </div>

      {/* Botones de Acción Rápida */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        <button 
          onClick={() => csl.emit('SPORT_EVENT', { team: 'HOME', type: 'GOAL' }, 'P0')}
          className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-xl flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all"
        >
          <Trophy className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black text-blue-400 uppercase">GOL LOCAL</span>
        </button>
        <button 
          onClick={() => csl.emit('SPORT_EVENT', { team: 'AWAY', type: 'GOAL' }, 'P0')}
          className="bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 rounded-xl flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all"
        >
          <Trophy className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black text-red-400 uppercase">GOL VISITA</span>
        </button>
        <button 
          onClick={() => csl.emit('REPLAY_MARK', null, 'P0')}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all"
        >
          <Rewind className="w-6 h-6 text-yellow-500" />
          <span className="text-[9px] font-black text-zinc-400 uppercase">MARCAR REPLAY</span>
        </button>
        <button 
          onClick={() => csl.emit('SPORT_EVENT', { type: 'FOUL' })}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all"
        >
          <Flag className="w-6 h-6 text-zinc-500" />
          <span className="text-[9px] font-black text-zinc-500 uppercase">FALTA / TARJETA</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
         <button className="py-2 bg-zinc-800 rounded-lg text-[8px] font-black text-zinc-500 uppercase border border-zinc-700 hover:text-white transition-colors">Alineación</button>
         <button className="py-2 bg-zinc-800 rounded-lg text-[8px] font-black text-zinc-500 uppercase border border-zinc-700 hover:text-white transition-colors">Sponsors</button>
         <button className="py-2 bg-zinc-800 rounded-lg text-[8px] font-black text-zinc-500 uppercase border border-zinc-700 hover:text-white transition-colors">Chat</button>
      </div>
    </div>
  );
};

export default PerformanceDeck;
