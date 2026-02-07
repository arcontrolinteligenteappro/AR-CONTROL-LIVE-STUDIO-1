
import React, { useState } from 'react';
import { ScoreboardState, SportEvent, SportType, Team, BaseballStats, MatchStatus, EventConfig } from '../types';
import { Plus, Minus, Play, Pause, Trophy, ChevronDown, Flag, User, ArrowRightLeft, Settings2, Users, Layout, Move, Settings, CheckCircle } from 'lucide-react';
import { formatTime, getPeriodLabel, resetScoreboardForSport, swapTeams, updateBaseballPlayerStats } from '../services/SportsEngine';
import { MOCK_TEAMS } from '../constants';
import TeamEditorModal from './TeamEditorModal';

interface CompactSportsControllerProps {
    state: ScoreboardState;
    onUpdate: (updates: Partial<ScoreboardState>) => void;
    onTriggerEvent: (event: SportEvent) => void;
    eventConfig: EventConfig | null; // Receive config
}

const CompactSportsController: React.FC<CompactSportsControllerProps> = ({ state, onUpdate, onTriggerEvent, eventConfig }) => {
    const [showSportSelector, setShowSportSelector] = useState(false);
    const [showContextSettings, setShowContextSettings] = useState(false);
    const [showLayoutSettings, setShowLayoutSettings] = useState(false);
    const [showRosterSelect, setShowRosterSelect] = useState<'HOME' | 'AWAY' | 'BATTER' | null>(null);
    const [editingTeam, setEditingTeam] = useState<'HOME' | 'AWAY' | null>(null);

    const handleSportChange = (sport: SportType) => {
        const newState = resetScoreboardForSport(sport);
        onUpdate(newState);
        setShowSportSelector(false);
    };

    const handleSwap = () => {
        onUpdate(swapTeams(state));
    };
    
    const handleSelectTeam = (side: 'HOME' | 'AWAY', team: Team) => {
        // Legacy mock support if config not present
        if (side === 'HOME') {
            onUpdate({ homeTeamId: team.id, homeName: team.name, homeColor: team.primaryColor, homeLogo: team.logoUrl });
        } else {
            onUpdate({ awayTeamId: team.id, awayName: team.name, awayColor: team.primaryColor, awayLogo: team.logoUrl });
        }
        setShowRosterSelect(null);
    }

    const handleSelectBatter = (player: any) => {
        onUpdate({ 
            activePlayerId: player.number, 
            activePlayerName: player.name,
            activePlayerStats: player.baseballStats
        });
        setShowRosterSelect(null);
    }

    // --- SOCCER WORKFLOW ---
    const handleSoccerPhase = (action: 'START' | 'HALFTIME' | 'SECOND_HALF' | 'FINISH') => {
        if (action === 'START') {
            onUpdate({ matchStatus: MatchStatus.FIRST_HALF, isTimerRunning: true, timerMinutes: 0, timerSeconds: 0, period: 1 });
        } else if (action === 'HALFTIME') {
            onUpdate({ matchStatus: MatchStatus.HALFTIME, isTimerRunning: false, timerMinutes: 45, timerSeconds: 0, addedMinutes: 0, addedSeconds: 0 });
        } else if (action === 'SECOND_HALF') {
            onUpdate({ matchStatus: MatchStatus.SECOND_HALF, isTimerRunning: true, timerMinutes: 45, timerSeconds: 0, addedMinutes: 0, addedSeconds: 0, targetDuration: 90, period: 2 });
        } else if (action === 'FINISH') {
            onUpdate({ matchStatus: MatchStatus.FULL_TIME, isTimerRunning: false, timerMinutes: 90, timerSeconds: 0, addedMinutes: 0, addedSeconds: 0 });
        }
    }

    const handleBaseballAction = (action: 'HIT' | 'HR' | 'SO' | 'WALK') => {
        // 1. Update Scoreboard Basics
        let updates: Partial<ScoreboardState> = {};
        
        if (action === 'HR') {
             const isTop = state.baseballStats?.inningTop;
             if (isTop) updates.awayScore = state.awayScore + 1;
             else updates.homeScore = state.homeScore + 1;
             onTriggerEvent(SportEvent.HOME_RUN);
        } else if (action === 'SO') {
             const currentOuts = state.baseballStats?.outs || 0;
             let newOuts = currentOuts + 1;
             let newBalls = state.baseballStats?.balls || 0;
             let newStrikes = state.baseballStats?.strikes || 0;
             let top = state.baseballStats?.inningTop || false;
             let per = state.period;

             if (newOuts >= 3) {
                 newOuts = 0;
                 newBalls = 0;
                 newStrikes = 0;
                 if (!top) per++; // End of inning
                 top = !top;
             }
             // Spread existing stats to maintain 'hits' and 'errors'
             updates.baseballStats = { ...state.baseballStats!, balls: newBalls, strikes: newStrikes, outs: newOuts, inningTop: top };
             updates.period = per;
        }

        const newStats = updateBaseballPlayerStats(state.activePlayerStats, action);
        updates.activePlayerStats = newStats;

        onUpdate(updates);
    }

    const isIndoorSoccer = state.sportType === SportType.INDOOR_SOCCER;
    const isBaseball = state.sportType === SportType.BASEBALL;
    const isSoccer = state.sportType === SportType.SOCCER;

    // Get Active Team Roster for Batter Selection
    let activeRoster: any[] = [];
    if (eventConfig) {
        const isTop = state.baseballStats?.inningTop;
        activeRoster = isTop ? eventConfig.awayTeam.players : eventConfig.homeTeam.players;
    } else {
        const activeTeamId = state.baseballStats?.inningTop ? state.awayTeamId : state.homeTeamId;
        activeRoster = MOCK_TEAMS.find(t => t.id === activeTeamId)?.players || [];
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            
            {/* 1. COMPACT HEADER: Sport & Timer */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                {/* Left: Sport Selector */}
                <div className="relative">
                    <button 
                        onClick={() => setShowSportSelector(!showSportSelector)}
                        className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded border border-zinc-700 w-full"
                    >
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-bold text-white uppercase truncate flex-1 text-left">{state.sportType.substring(0,8)}</span>
                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                    </button>
                    {showSportSelector && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded shadow-xl z-50 max-h-64 overflow-y-auto">
                             {(Object.values(SportType) as SportType[]).map((sport) => (
                                <button
                                    key={sport}
                                    onClick={() => handleSportChange(sport)}
                                    className="w-full text-left px-3 py-2 text-xs font-bold uppercase text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                    {sport}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Center: Timer Display */}
                <div className="flex flex-col items-center">
                    <div className="flex items-baseline gap-1">
                        <div className={`font-mono text-2xl font-bold tracking-widest leading-none ${state.isTimerRunning ? 'text-green-500' : 'text-red-500'}`}>
                            {formatTime(state.timerMinutes, state.timerSeconds)}
                        </div>
                        {state.addedMinutes !== undefined && (state.addedMinutes > 0 || (state.addedSeconds || 0) > 0) ? (
                            <span className="text-xs font-mono text-yellow-500 animate-pulse">+{formatTime(state.addedMinutes, state.addedSeconds || 0)}</span>
                        ) : null}
                    </div>
                    <div className="text-[9px] text-zinc-500 uppercase font-bold">{getPeriodLabel(state)}</div>
                </div>

                {/* Right: Timer Controls */}
                <div className="flex gap-1 justify-end">
                    <button 
                        onClick={() => onUpdate({ isTimerRunning: !state.isTimerRunning })}
                        className={`w-10 h-10 rounded flex items-center justify-center ${state.isTimerRunning ? 'bg-zinc-800 text-red-500 border border-red-900' : 'bg-green-600 text-white shadow-lg'}`}
                    >
                        {state.isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    {isSoccer ? (
                        <div className="flex flex-col gap-px">
                             <button onClick={() => onUpdate({ timerMinutes: state.timerMinutes + 1 })} className="bg-zinc-800 w-6 h-5 flex items-center justify-center rounded-t text-[8px] hover:text-white text-zinc-400"><Plus className="w-2 h-2"/></button>
                             <button onClick={() => onUpdate({ timerMinutes: Math.max(0, state.timerMinutes - 1) })} className="bg-zinc-800 w-6 h-5 flex items-center justify-center rounded-b text-[8px] hover:text-white text-zinc-400"><Minus className="w-2 h-2"/></button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => onUpdate({ period: state.period + 1 })}
                            className="w-10 h-10 bg-zinc-800 rounded flex flex-col items-center justify-center border border-zinc-700 text-zinc-400"
                        >
                            <span className="text-[8px] font-bold">PER</span>
                            <span className="text-xs font-bold text-white">+1</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 2. SCOREBOARD GRID: Home vs Away */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
                {/* HOME */}
                <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800 flex flex-col items-center relative" style={{ borderColor: state.homeColor || '#3f3f46' }}>
                    <div className="absolute top-2 left-2 flex gap-1">
                        <button onClick={() => setShowRosterSelect(showRosterSelect === 'HOME' ? null : 'HOME')} className="text-zinc-500 hover:text-white"><Users className="w-3 h-3"/></button>
                        <button onClick={() => setEditingTeam('HOME')} className="text-zinc-500 hover:text-blue-400"><Settings className="w-3 h-3"/></button>
                    </div>
                    
                    <input 
                        value={state.homeName}
                        onChange={(e) => onUpdate({ homeName: e.target.value })}
                        className="w-full bg-transparent text-center text-xs font-black text-zinc-400 uppercase outline-none mb-1 focus:text-white"
                    />
                    <button 
                        onClick={() => onUpdate({ homeScore: state.homeScore + 1 })}
                        className="w-full flex-1 bg-zinc-950 rounded flex items-center justify-center text-5xl font-black text-white py-2 border border-zinc-800 active:scale-95 transition-transform"
                    >
                        {state.homeScore}
                    </button>
                    
                    {/* Indoor Soccer Fouls */}
                    {isIndoorSoccer && (
                         <div className="w-full flex justify-between items-center mt-2 px-1">
                            <span className="text-[9px] text-zinc-500">FALTAS</span>
                            <div className="flex gap-1">
                                <button onClick={() => onUpdate({ homeFouls: Math.max(0, (state.homeFouls || 0) - 1) })} className="px-1.5 bg-zinc-800 rounded text-zinc-400">-</button>
                                <span className="font-bold text-yellow-500">{state.homeFouls || 0}</span>
                                <button onClick={() => onUpdate({ homeFouls: (state.homeFouls || 0) + 1 })} className="px-1.5 bg-zinc-800 rounded text-zinc-400">+</button>
                            </div>
                         </div>
                    )}
                    
                    {!isIndoorSoccer && (
                        <div className="flex w-full gap-1 mt-2">
                            <button onClick={() => onUpdate({ homeScore: Math.max(0, state.homeScore - 1) })} className="flex-1 bg-zinc-800 py-2 rounded text-zinc-400 hover:bg-zinc-700"><Minus className="w-4 h-4 mx-auto"/></button>
                        </div>
                    )}
                    
                    {/* Roster Popup */}
                    {showRosterSelect === 'HOME' && (
                        <div className="absolute top-8 left-0 w-48 bg-zinc-900 border border-zinc-600 rounded shadow-xl z-50 p-1">
                            {(eventConfig ? [eventConfig.homeTeam] : MOCK_TEAMS).map(t => (
                                <button key={t.id} onClick={() => handleSelectTeam('HOME', t)} className="w-full text-left p-2 hover:bg-zinc-800 text-xs font-bold text-white block">{t.name}</button>
                            ))}
                        </div>
                    )}
                </div>

                {/* VS / ACTIONS / SETTINGS */}
                <div className="flex flex-col justify-center gap-2">
                     <button onClick={handleSwap} className="p-2 bg-zinc-800 rounded-full text-zinc-500 hover:text-white border border-zinc-700">
                        <ArrowRightLeft className="w-4 h-4" />
                     </button>
                     <button onClick={() => setShowContextSettings(!showContextSettings)} className={`p-2 rounded-full border ${state.matchContext.mode !== 'REGULAR' ? 'bg-purple-900/50 text-purple-400 border-purple-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                        <Settings2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => setShowLayoutSettings(!showLayoutSettings)} className={`p-2 rounded-full border ${showLayoutSettings ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                        <Layout className="w-4 h-4" />
                     </button>
                </div>

                {/* AWAY */}
                <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800 flex flex-col items-center relative" style={{ borderColor: state.awayColor || '#3f3f46' }}>
                    <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => setEditingTeam('AWAY')} className="text-zinc-500 hover:text-blue-400"><Settings className="w-3 h-3"/></button>
                        <button onClick={() => setShowRosterSelect(showRosterSelect === 'AWAY' ? null : 'AWAY')} className="text-zinc-500 hover:text-white"><Users className="w-3 h-3"/></button>
                    </div>

                    <input 
                        value={state.awayName}
                        onChange={(e) => onUpdate({ awayName: e.target.value })}
                        className="w-full bg-transparent text-center text-xs font-black text-zinc-400 uppercase outline-none mb-1 focus:text-white"
                    />
                    <button 
                        onClick={() => onUpdate({ awayScore: state.awayScore + 1 })}
                        className="w-full flex-1 bg-zinc-950 rounded flex items-center justify-center text-5xl font-black text-white py-2 border border-zinc-800 active:scale-95 transition-transform"
                    >
                        {state.awayScore}
                    </button>
                    
                     {/* Indoor Soccer Fouls */}
                     {isIndoorSoccer && (
                         <div className="w-full flex justify-between items-center mt-2 px-1">
                            <span className="text-[9px] text-zinc-500">FALTAS</span>
                            <div className="flex gap-1">
                                <button onClick={() => onUpdate({ awayFouls: Math.max(0, (state.awayFouls || 0) - 1) })} className="px-1.5 bg-zinc-800 rounded text-zinc-400">-</button>
                                <span className="font-bold text-yellow-500">{state.awayFouls || 0}</span>
                                <button onClick={() => onUpdate({ awayFouls: (state.awayFouls || 0) + 1 })} className="px-1.5 bg-zinc-800 rounded text-zinc-400">+</button>
                            </div>
                         </div>
                    )}
                    
                    {!isIndoorSoccer && (
                        <div className="flex w-full gap-1 mt-2">
                             <button onClick={() => onUpdate({ awayScore: Math.max(0, state.awayScore - 1) })} className="flex-1 bg-zinc-800 py-2 rounded text-zinc-400 hover:bg-zinc-700"><Minus className="w-4 h-4 mx-auto"/></button>
                        </div>
                    )}

                    {/* Roster Popup */}
                    {showRosterSelect === 'AWAY' && (
                        <div className="absolute top-8 right-0 w-48 bg-zinc-900 border border-zinc-600 rounded shadow-xl z-50 p-1">
                            {(eventConfig ? [eventConfig.awayTeam] : MOCK_TEAMS).map(t => (
                                <button key={t.id} onClick={() => handleSelectTeam('AWAY', t)} className="w-full text-left p-2 hover:bg-zinc-800 text-xs font-bold text-white block">{t.name}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. LAYOUT DRAWER (Opacity/Position) */}
            {showLayoutSettings && (
                <div className="bg-zinc-950 border border-zinc-700 rounded p-3 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-zinc-300 flex items-center gap-2"><Move className="w-3 h-3 text-blue-500"/> Posición Marcador</span>
                        <div className="grid grid-cols-2 w-16 h-12 gap-1 bg-zinc-900 p-1 rounded">
                            <button onClick={() => onUpdate({ overlaySettings: {...state.overlaySettings, position: 'TOP_LEFT'} })} className={`rounded ${state.overlaySettings.position === 'TOP_LEFT' ? 'bg-blue-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}></button>
                            <button onClick={() => onUpdate({ overlaySettings: {...state.overlaySettings, position: 'TOP_RIGHT'} })} className={`rounded ${state.overlaySettings.position === 'TOP_RIGHT' ? 'bg-blue-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}></button>
                            <button onClick={() => onUpdate({ overlaySettings: {...state.overlaySettings, position: 'BOTTOM_LEFT'} })} className={`rounded ${state.overlaySettings.position === 'BOTTOM_LEFT' ? 'bg-blue-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}></button>
                            <button onClick={() => onUpdate({ overlaySettings: {...state.overlaySettings, position: 'BOTTOM_RIGHT'} })} className={`rounded ${state.overlaySettings.position === 'BOTTOM_RIGHT' ? 'bg-blue-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}></button>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-[9px] text-zinc-500 mb-1 uppercase font-bold">
                                <span>Opacidad</span>
                                <span>{(state.overlaySettings.opacity * 100).toFixed(0)}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="1" step="0.1" 
                                value={state.overlaySettings.opacity}
                                onChange={(e) => onUpdate({ overlaySettings: { ...state.overlaySettings, opacity: parseFloat(e.target.value) } })}
                                className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-[9px] text-zinc-500 mb-1 uppercase font-bold">
                                <span>Escala</span>
                                <span>{state.overlaySettings.scale.toFixed(1)}x</span>
                            </div>
                            <input 
                                type="range" min="0.5" max="1.5" step="0.1" 
                                value={state.overlaySettings.scale}
                                onChange={(e) => onUpdate({ overlaySettings: { ...state.overlaySettings, scale: parseFloat(e.target.value) } })}
                                className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                            <span className="text-[10px] text-zinc-400">Mostrar sobre Videos (Ads/Intro)</span>
                            <button 
                                onClick={() => onUpdate({ overlaySettings: { ...state.overlaySettings, keepOnScenes: !state.overlaySettings.keepOnScenes } })}
                                className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${state.overlaySettings.keepOnScenes ? 'bg-green-500 justify-end' : 'bg-zinc-800 justify-start'}`}
                            >
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. CONTEXT DRAWER */}
            {showContextSettings && (
                 <div className="bg-zinc-900 border border-zinc-800 rounded p-2 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-3 gap-1 mb-2">
                        <button onClick={() => onUpdate({ matchContext: { ...state.matchContext, mode: 'REGULAR' } })} className={`text-[10px] py-2 rounded font-bold uppercase ${state.matchContext.mode === 'REGULAR' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Regular</button>
                        <button onClick={() => onUpdate({ matchContext: { ...state.matchContext, mode: 'SERIES_PLAYOFF' } })} className={`text-[10px] py-2 rounded font-bold uppercase ${state.matchContext.mode === 'SERIES_PLAYOFF' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Playoff</button>
                        <button onClick={() => onUpdate({ matchContext: { ...state.matchContext, mode: 'AGGREGATE_LEGS' } })} className={`text-[10px] py-2 rounded font-bold uppercase ${state.matchContext.mode === 'AGGREGATE_LEGS' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Global</button>
                    </div>
                    {/* Time Config */}
                    <div className="flex items-center justify-between border-t border-zinc-700 pt-2">
                        <span className="text-[10px] text-zinc-400 uppercase">Duración de Tiempo</span>
                        <input type="number" value={state.targetDuration || 90} onChange={(e) => onUpdate({targetDuration: parseInt(e.target.value)})} className="w-12 bg-zinc-800 text-white text-xs p-1 rounded border border-zinc-600 text-center" />
                    </div>
                 </div>
            )}

            {/* 4. QUICK ACTIONS GRID */}
            
            {/* SOCCER WORKFLOW CONTROLS */}
            {isSoccer && (
                <div className="flex gap-2 mb-2">
                    {state.matchStatus === MatchStatus.PRE_MATCH && (
                        <button onClick={() => handleSoccerPhase('START')} className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 rounded text-[10px] font-bold uppercase">Inicio 1er Tiempo</button>
                    )}
                    {state.matchStatus === MatchStatus.FIRST_HALF && (
                        <button onClick={() => handleSoccerPhase('HALFTIME')} className="flex-1 bg-yellow-700 hover:bg-yellow-600 text-white py-2 rounded text-[10px] font-bold uppercase">Medio Tiempo</button>
                    )}
                    {state.matchStatus === MatchStatus.HALFTIME && (
                        <button onClick={() => handleSoccerPhase('SECOND_HALF')} className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 rounded text-[10px] font-bold uppercase">Inicio 2do Tiempo</button>
                    )}
                    {state.matchStatus === MatchStatus.SECOND_HALF && (
                        <button onClick={() => handleSoccerPhase('FINISH')} className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 rounded text-[10px] font-bold uppercase">Finalizar Partido</button>
                    )}
                    {state.matchStatus === MatchStatus.FULL_TIME && (
                        <div className="flex-1 bg-zinc-800 py-2 rounded text-[10px] font-bold uppercase text-zinc-400 flex items-center justify-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500"/> Finalizado
                        </div>
                    )}
                </div>
            )}

            {/* BASEBALL SPECIFIC MODE */}
            {isBaseball ? (
                <div className="flex flex-col gap-2 flex-1">
                    <div className="bg-zinc-900 border border-zinc-700 rounded p-2 flex items-center justify-between relative">
                        <button 
                            onClick={() => setShowRosterSelect(showRosterSelect === 'BATTER' ? null : 'BATTER')}
                            className="flex items-center gap-2"
                        >
                            <User className="w-5 h-5 text-blue-500" />
                            <div className="text-left">
                                <div className="text-[9px] text-zinc-500 uppercase">Al Bat</div>
                                <div className="text-sm font-bold text-white">{state.activePlayerName || "Seleccionar"}</div>
                            </div>
                        </button>
                        {state.activePlayerStats && (
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-500">AVG: {state.activePlayerStats.avg}</div>
                                <div className="text-[9px] text-zinc-400">HR: {state.activePlayerStats.homeRuns}</div>
                            </div>
                        )}
                         {/* Batter Selector Popup */}
                         {showRosterSelect === 'BATTER' && (
                            <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-600 rounded shadow-xl z-50 p-1 max-h-48 overflow-y-auto">
                                {(activeRoster as any[]).length > 0 ? (activeRoster as any[]).map((p, idx) => (
                                    <button key={idx} onClick={() => handleSelectBatter(p)} className="w-full text-left p-2 hover:bg-zinc-800 text-xs font-bold text-white block">
                                        #{p.number} {p.name}
                                    </button>
                                )) : <div className="p-2 text-xs text-zinc-500">Asigna equipos primero</div>}
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1 h-16">
                         <button onClick={() => handleBaseballAction('HIT')} className="bg-green-900/40 border border-green-600/50 text-green-500 rounded font-black text-xs">HIT</button>
                         <button onClick={() => handleBaseballAction('HR')} className="bg-purple-900/40 border border-purple-600/50 text-purple-400 rounded font-black text-xs">HR</button>
                         <button onClick={() => handleBaseballAction('WALK')} className="bg-blue-900/40 border border-blue-600/50 text-blue-400 rounded font-black text-xs">WALK</button>
                         <button onClick={() => handleBaseballAction('SO')} className="bg-red-900/40 border border-red-600/50 text-red-500 rounded font-black text-xs">OUT</button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 h-12">
                         <button onClick={() => onUpdate({ baseballStats: { ...state.baseballStats!, balls: (state.baseballStats?.balls || 0) + 1 } })} className="bg-zinc-800 rounded text-xs text-zinc-300">BOLA +</button>
                         <button onClick={() => onUpdate({ baseballStats: { ...state.baseballStats!, strikes: (state.baseballStats?.strikes || 0) + 1 } })} className="bg-zinc-800 rounded text-xs text-zinc-300">STRIKE +</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 flex-1">
                    <button 
                        onClick={() => onTriggerEvent(SportEvent.GOAL)}
                        className="bg-zinc-800 border border-zinc-700 hover:bg-yellow-900/20 hover:border-yellow-500/50 rounded-lg flex flex-col items-center justify-center gap-1 min-h-[60px] active:bg-yellow-600 transition-colors"
                    >
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs font-black uppercase text-zinc-300">Gol / Punto</span>
                    </button>
                    
                    {isIndoorSoccer ? (
                        <button 
                            onClick={() => onUpdate({ isShootout: !state.isShootout })}
                            className={`border rounded-lg flex flex-col items-center justify-center gap-1 min-h-[60px] ${state.isShootout ? 'bg-orange-900/50 border-orange-500 animate-pulse' : 'bg-zinc-800 border-zinc-700'}`}
                        >
                            <Trophy className="w-5 h-5 text-orange-500" />
                            <span className="text-xs font-black uppercase text-zinc-300">Modo Penales</span>
                        </button>
                    ) : (
                        <button 
                            onClick={() => onTriggerEvent(SportEvent.FOUL)}
                            className="bg-zinc-800 border border-zinc-700 hover:bg-red-900/20 hover:border-red-500/50 rounded-lg flex flex-col items-center justify-center gap-1 min-h-[60px] active:bg-red-600 transition-colors"
                        >
                            <Flag className="w-5 h-5 text-red-500" />
                            <span className="text-xs font-black uppercase text-zinc-300">Falta</span>
                        </button>
                    )}
                    
                    <button 
                        onClick={() => onTriggerEvent(SportEvent.TIMEOUT)}
                        className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg flex flex-col items-center justify-center gap-1 min-h-[60px]"
                    >
                        <Trophy className="w-5 h-5 text-zinc-400" />
                        <span className="text-xs font-black uppercase text-zinc-300">Timeout</span>
                    </button>
                    <button 
                        onClick={() => onUpdate({ isVisible: !state.isVisible })}
                        className={`border rounded-lg flex flex-col items-center justify-center gap-1 min-h-[60px] ${state.isVisible ? 'bg-green-900/20 border-green-500/30' : 'bg-zinc-800 border-zinc-700'}`}
                    >
                        <div className={`w-3 h-3 rounded-full ${state.isVisible ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
                        <span className="text-xs font-black uppercase text-zinc-300">{state.isVisible ? 'Visible' : 'Oculto'}</span>
                    </button>
                </div>
            )}

            {/* TEAM EDITOR MODAL */}
            {editingTeam && (
                <TeamEditorModal 
                    side={editingTeam}
                    name={editingTeam === 'HOME' ? state.homeName : state.awayName}
                    color={editingTeam === 'HOME' ? state.homeColor || '#FFFFFF' : state.awayColor || '#FFFFFF'}
                    logoUrl={editingTeam === 'HOME' ? state.homeLogo : state.awayLogo}
                    onClose={() => setEditingTeam(null)}
                    onSave={(data) => {
                        if (editingTeam === 'HOME') {
                            onUpdate({ homeName: data.name, homeColor: data.color, homeLogo: data.logoUrl });
                        } else {
                            onUpdate({ awayName: data.name, awayColor: data.color, awayLogo: data.logoUrl });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CompactSportsController;
