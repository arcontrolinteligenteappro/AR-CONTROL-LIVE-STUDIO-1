import React, { useState } from 'react';
import { BroadcastOverlayType, BroadcastState, EventConfig, PlayerStatus } from '../types';
import { MOCK_TEAMS } from '../constants';
import { LayoutTemplate, Users, UserCog, MonitorPlay, XCircle, Settings, Edit } from 'lucide-react';
import BroadcastEditorModal from './BroadcastEditorModal';

interface BroadcastGraphicsControllerProps {
    state: BroadcastState;
    onUpdate: (updates: Partial<BroadcastState>) => void;
    eventConfig: EventConfig | null; // Optional config to drive lineups
}

const BroadcastGraphicsController: React.FC<BroadcastGraphicsControllerProps> = ({ state, onUpdate, eventConfig }) => {
    
    const [showEditor, setShowEditor] = useState(false);

    const isActive = (type: BroadcastOverlayType) => state.activeOverlay === type;

    const toggle = (type: BroadcastOverlayType) => {
        if (state.activeOverlay === type) {
            onUpdate({ activeOverlay: BroadcastOverlayType.NONE });
        } else {
            onUpdate({ activeOverlay: type });
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                    <LayoutTemplate className="w-3.5 h-3.5 text-pink-500" /> Gráficos de Transmisión
                </h3>
                <button 
                    onClick={() => setShowEditor(true)}
                    className="p-1 text-zinc-500 hover:text-white bg-zinc-800 rounded hover:bg-zinc-700"
                    title="Edit Content"
                >
                    <Settings className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <button 
                    onClick={() => toggle(BroadcastOverlayType.MATCH_INTRO)}
                    className={`py-3 px-2 rounded border flex flex-col items-center justify-center gap-1 transition-all ${isActive(BroadcastOverlayType.MATCH_INTRO) ? 'bg-pink-900/30 border-pink-500 text-pink-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                >
                    <MonitorPlay className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase">Intro del Partido</span>
                </button>

                <button 
                    onClick={() => toggle(BroadcastOverlayType.REFEREES)}
                    className={`py-3 px-2 rounded border flex flex-col items-center justify-center gap-1 transition-all ${isActive(BroadcastOverlayType.REFEREES) ? 'bg-pink-900/30 border-pink-500 text-pink-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                >
                    <UserCog className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase">Cuerpo Arbitral</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex gap-1">
                    <button 
                        onClick={() => toggle(BroadcastOverlayType.LINEUP_HOME)}
                        className={`flex-1 py-3 px-2 rounded border flex flex-col items-center justify-center gap-1 transition-all ${isActive(BroadcastOverlayType.LINEUP_HOME) ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase">Alineación Local</span>
                    </button>
                </div>

                <div className="flex gap-1">
                    <button 
                        onClick={() => toggle(BroadcastOverlayType.LINEUP_AWAY)}
                        className={`flex-1 py-3 px-2 rounded border flex flex-col items-center justify-center gap-1 transition-all ${isActive(BroadcastOverlayType.LINEUP_AWAY) ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase">Alineación Visita</span>
                    </button>
                </div>
            </div>
            
            {state.activeOverlay !== BroadcastOverlayType.NONE && (
                <button 
                    onClick={() => onUpdate({ activeOverlay: BroadcastOverlayType.NONE })}
                    className="w-full mt-3 py-2 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase rounded hover:bg-zinc-700 flex items-center justify-center gap-2"
                >
                    <XCircle className="w-3 h-3"/> Limpiar Gráficos
                </button>
            )}

            {/* Validation warning if trying to show lineup without data */}
            {(isActive(BroadcastOverlayType.LINEUP_HOME) || isActive(BroadcastOverlayType.LINEUP_AWAY)) && eventConfig && (
                <div className="mt-2 text-[9px] text-zinc-500 text-center">
                    Mostrando Titulares ({isActive(BroadcastOverlayType.LINEUP_HOME) 
                        ? eventConfig.homeTeam.players.filter(p => p.status === PlayerStatus.STARTER).length 
                        : eventConfig.awayTeam.players.filter(p => p.status === PlayerStatus.STARTER).length})
                </div>
            )}

            {showEditor && (
                <BroadcastEditorModal 
                    state={state} 
                    onUpdate={onUpdate} 
                    onClose={() => setShowEditor(false)} 
                />
            )}
        </div>
    );
};

export default BroadcastGraphicsController;