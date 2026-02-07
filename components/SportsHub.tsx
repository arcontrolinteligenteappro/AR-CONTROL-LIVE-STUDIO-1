
import React from 'react';
import { ScoreboardState } from '../types';
import { Play, Pause, RotateCcw, Eye, EyeOff, Plus, Minus, Trophy } from 'lucide-react';

interface Props {
  state: ScoreboardState;
  onUpdate: (s: ScoreboardState) => void;
}

const SportsHub: React.FC<Props> = ({ state, onUpdate }) => {
  const toggleVisibility = () => onUpdate({ ...state, isVisible: !state.isVisible });
  const updateScore = (team: 'home' | 'away', delta: number) => {
    if (team === 'home') onUpdate({ ...state, homeScore: Math.max(0, state.homeScore + delta) });
    else onUpdate({ ...state, awayScore: Math.max(0, state.awayScore + delta) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2">
            <Trophy className="w-3 h-3 text-yellow-500" /> Score Engine
          </h3>
          <button 
            onClick={toggleVisibility}
            className={`p-1.5 rounded-full transition-all ${state.isVisible ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
          >
            {state.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-900 p-2 rounded border border-zinc-800 text-center">
            <div className="text-[9px] font-bold text-zinc-500 uppercase mb-2">{state.homeName}</div>
            <div className="text-3xl font-black text-white font-mono leading-none">{state.homeScore}</div>
            <div className="flex justify-center gap-1 mt-3">
              <button onClick={() => updateScore('home', -1)} className="p-1.5 bg-zinc-800 rounded"><Minus className="w-3 h-3"/></button>
              <button onClick={() => updateScore('home', 1)} className="p-1.5 bg-zinc-800 rounded"><Plus className="w-3 h-3"/></button>
            </div>
          </div>
          <div className="bg-zinc-900 p-2 rounded border border-zinc-800 text-center">
            <div className="text-[9px] font-bold text-zinc-500 uppercase mb-2">{state.awayName}</div>
            <div className="text-3xl font-black text-white font-mono leading-none">{state.awayScore}</div>
            <div className="flex justify-center gap-1 mt-3">
              <button onClick={() => updateScore('away', -1)} className="p-1.5 bg-zinc-800 rounded"><Minus className="w-3 h-3"/></button>
              <button onClick={() => updateScore('away', 1)} className="p-1.5 bg-zinc-800 rounded"><Plus className="w-3 h-3"/></button>
            </div>
          </div>
        </div>

        <div className="bg-black/40 rounded p-2 flex items-center justify-between border border-zinc-800/50">
          <div className="text-xl font-mono text-zinc-300 font-bold">{state.timer}</div>
          <div className="flex gap-2">
            <button className="p-2 bg-green-600/20 text-green-500 rounded-full"><Play className="w-3 h-3"/></button>
            <button className="p-2 bg-zinc-800 text-zinc-400 rounded-full"><RotateCcw className="w-3 h-3"/></button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
         <button className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded text-[9px] font-black uppercase text-zinc-400 border border-zinc-700">Set Replay Mark</button>
         <button className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded text-[9px] font-black uppercase text-zinc-400 border border-zinc-700">Next Half</button>
      </div>
    </div>
  );
};

export default SportsHub;
