import React from 'react';
import { ScoreboardState, SportEvent } from '../types';
import { Play, Pause, RotateCcw, Eye, EyeOff, Plus, Minus, Trophy, Flag, Timer } from 'lucide-react';
import { formatTime } from '../services/SportsEngine';

interface SportsControllerProps {
    state: ScoreboardState;
    onUpdate: (updates: Partial<ScoreboardState>) => void;
    onTriggerEvent: (event: SportEvent) => void;
}

const SportsController: React.FC<SportsControllerProps> = ({ state, onUpdate, onTriggerEvent }) => {
    
    const adjustScore = (team: 'home' | 'away', delta: number) => {
        if (team === 'home') {
            onUpdate({ homeScore: Math.max(0, state.homeScore + delta) });
        } else {
            onUpdate({ awayScore: Math.max(0, state.awayScore + delta) });
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500" /> Sports Engine
                </h3>
                <button 
                    onClick={() => onUpdate({ isVisible: !state.isVisible })}
                    className={`p-1 rounded ${state.isVisible ? 'bg-blue-600/20 text-blue-400' : 'bg-zinc-800 text-zinc-500'}`}
                >
                    {state.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* Teams & Scores */}
            <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-zinc-950 p-2 rounded border border-zinc-800 text-center">
                    <input 
                        value={state.homeName}
                        onChange={(e) => onUpdate({ homeName: e.target.value })}
                        className="w-full bg-transparent text-center text-[10px] font-bold text-zinc-500 uppercase mb-1 outline-none"
                    />
                    <div className="text-2xl font-black text-white font-mono leading-none mb-2">{state.homeScore}</div>
                    <div className="flex justify-center gap-1">
                        <button onClick={() => adjustScore('home', -1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded"><Minus className="w-3 h-3"/></button>
                        <button onClick={() => adjustScore('home', 1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded"><Plus className="w-3 h-3"/></button>
                    </div>
                </div>
                <div className="flex-1 bg-zinc-950 p-2 rounded border border-zinc-800 text-center">
                    <input 
                        value={state.awayName}
                        onChange={(e) => onUpdate({ awayName: e.target.value })}
                        className="w-full bg-transparent text-center text-[10px] font-bold text-zinc-500 uppercase mb-1 outline-none"
                    />
                    <div className="text-2xl font-black text-white font-mono leading-none mb-2">{state.awayScore}</div>
                    <div className="flex justify-center gap-1">
                        <button onClick={() => adjustScore('away', -1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded"><Minus className="w-3 h-3"/></button>
                        <button onClick={() => adjustScore('away', 1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded"><Plus className="w-3 h-3"/></button>
                    </div>
                </div>
            </div>

            {/* Timer Control */}
            <div className="bg-zinc-800/50 rounded p-2 flex items-center justify-between mb-3">
                <div className="font-mono text-lg font-bold text-white tracking-widest">
                    {formatTime(state.timerMinutes, state.timerSeconds)}
                </div>
                <div className="flex gap-1">
                    <button 
                        onClick={() => onUpdate({ isTimerRunning: !state.isTimerRunning })}
                        className={`p-1.5 rounded ${state.isTimerRunning ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}
                    >
                        {state.isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button 
                        onClick={() => onUpdate({ timerMinutes: 45, timerSeconds: 0, isTimerRunning: false })}
                        className="p-1.5 bg-zinc-700 text-zinc-300 rounded hover:bg-zinc-600"
                    >
                        <RotateCcw className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Event Triggers */}
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => onTriggerEvent(SportEvent.GOAL)}
                    className="bg-zinc-800 hover:bg-green-900/40 hover:text-green-500 hover:border-green-500 border border-zinc-700 text-zinc-300 py-3 rounded text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 transition-all"
                >
                    <Trophy className="w-4 h-4" /> Goal
                </button>
                <button 
                    onClick={() => onTriggerEvent(SportEvent.FOUL)}
                    className="bg-zinc-800 hover:bg-yellow-900/40 hover:text-yellow-500 hover:border-yellow-500 border border-zinc-700 text-zinc-300 py-3 rounded text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 transition-all"
                >
                    <Flag className="w-4 h-4" /> Foul
                </button>
                <button 
                    onClick={() => onTriggerEvent(SportEvent.TIMEOUT)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 py-3 rounded text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 transition-all"
                >
                    <Timer className="w-4 h-4" /> Timeout
                </button>
                <button 
                     onClick={() => onTriggerEvent(SportEvent.SET_POINT)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 py-3 rounded text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 transition-all"
                >
                    Set Point
                </button>
            </div>
        </div>
    );
};

export default SportsController;