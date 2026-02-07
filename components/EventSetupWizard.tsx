
import React, { useState } from 'react';
import { EventConfig, SportType, Team, Player, PlayerStatus, MatchOfficial, MatchStatus } from '../types';
import { MOCK_TEAMS } from '../constants';
import { Users, UserPlus, ArrowRight, Save, ShieldCheck, MapPin, ClipboardList, Trash2, AlertTriangle } from 'lucide-react';

interface EventSetupWizardProps {
    onComplete: (config: EventConfig) => void;
    onClose: () => void;
}

// Initial Empty Config
const INITIAL_CONFIG: EventConfig = {
    isConfigured: false,
    sport: SportType.SOCCER,
    metadata: {
        leagueName: '',
        venue: '',
        city: '',
        date: new Date().toISOString().split('T')[0],
        weather: ''
    },
    homeTeam: {
        id: 'home-temp', name: 'LOCAL', shortName: 'LOC', primaryColor: '#1d4ed8', coach: '', players: []
    },
    awayTeam: {
        id: 'away-temp', name: 'VISITA', shortName: 'VIS', primaryColor: '#b91c1c', coach: '', players: []
    },
    officials: []
};

const EventSetupWizard: React.FC<EventSetupWizardProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [config, setConfig] = useState<EventConfig>(INITIAL_CONFIG);
    
    // Helper to update deeply nested state
    const updateMetadata = (updates: Partial<EventConfig['metadata']>) => {
        setConfig(prev => ({ ...prev, metadata: { ...prev.metadata, ...updates } }));
    };

    const updateTeam = (side: 'HOME' | 'AWAY', updates: Partial<Team>) => {
        setConfig(prev => ({
            ...prev,
            [side === 'HOME' ? 'homeTeam' : 'awayTeam']: {
                ...(side === 'HOME' ? prev.homeTeam : prev.awayTeam),
                ...updates
            }
        }));
    };

    // --- PLAYER MANAGEMENT ---
    const addPlayer = (side: 'HOME' | 'AWAY') => {
        const newPlayer: Player = {
            id: `p-${Date.now()}`,
            number: 0,
            name: 'Nuevo Jugador',
            position: 'GEN',
            status: PlayerStatus.SUB,
            order: 99
        };
        const teamKey = side === 'HOME' ? 'homeTeam' : 'awayTeam';
        setConfig(prev => ({
            ...prev,
            [teamKey]: {
                ...prev[teamKey],
                players: [...prev[teamKey].players, newPlayer]
            }
        }));
    };

    const updatePlayer = (side: 'HOME' | 'AWAY', playerId: string, updates: Partial<Player>) => {
        const teamKey = side === 'HOME' ? 'homeTeam' : 'awayTeam';
        setConfig(prev => ({
            ...prev,
            [teamKey]: {
                ...prev[teamKey],
                players: prev[teamKey].players.map(p => p.id === playerId ? { ...p, ...updates } : p)
            }
        }));
    };

    const removePlayer = (side: 'HOME' | 'AWAY', playerId: string) => {
        const teamKey = side === 'HOME' ? 'homeTeam' : 'awayTeam';
        setConfig(prev => ({
            ...prev,
            [teamKey]: {
                ...prev[teamKey],
                players: prev[teamKey].players.filter(p => p.id !== playerId)
            }
        }));
    };

    const handleFinish = () => {
        // Validation could go here
        onComplete({ ...config, isConfigured: true });
    };

    // --- RENDER STEPS ---

    const renderStep1_General = () => (
        <div className="space-y-4 animate-in slide-in-from-right">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Deporte / Perfil</label>
                    <select 
                        value={config.sport}
                        onChange={(e) => setConfig({...config, sport: e.target.value as SportType})}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white font-bold"
                    >
                        {(Object.values(SportType) as SportType[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Fecha</label>
                    <input 
                        type="date"
                        value={config.metadata.date}
                        onChange={(e) => updateMetadata({ date: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Torneo / Liga</label>
                <input 
                    type="text"
                    value={config.metadata.leagueName}
                    onChange={(e) => updateMetadata({ leagueName: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white placeholder-zinc-600"
                    placeholder="Ej: Final Regional Clausura 2024"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Estadio / Sede</label>
                    <div className="relative">
                        <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-zinc-500" />
                        <input 
                            type="text"
                            value={config.metadata.venue}
                            onChange={(e) => updateMetadata({ venue: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 pl-8 text-white placeholder-zinc-600"
                            placeholder="Nombre del Estadio"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Ciudad</label>
                    <input 
                        type="text"
                        value={config.metadata.city}
                        onChange={(e) => updateMetadata({ city: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white placeholder-zinc-600"
                        placeholder="Ciudad"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2_Teams = () => (
        <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right">
            {/* HOME TEAM */}
            <div className="bg-zinc-800/50 p-4 rounded border border-zinc-700">
                <h3 className="text-blue-400 font-bold uppercase mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Equipo Local</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Nombre Completo</label>
                        <input 
                            value={config.homeTeam.name}
                            onChange={(e) => updateTeam('HOME', { name: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Alias (3 Letras)</label>
                            <input 
                                value={config.homeTeam.shortName}
                                onChange={(e) => updateTeam('HOME', { shortName: e.target.value.substring(0,3).toUpperCase() })}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white text-center font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Color</label>
                            <input 
                                type="color"
                                value={config.homeTeam.primaryColor}
                                onChange={(e) => updateTeam('HOME', { primaryColor: e.target.value })}
                                className="w-full h-9 bg-zinc-900 border border-zinc-700 rounded p-1 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Director Técnico</label>
                        <input 
                            value={config.homeTeam.coach}
                            onChange={(e) => updateTeam('HOME', { coach: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white"
                        />
                    </div>
                </div>
            </div>

            {/* AWAY TEAM */}
            <div className="bg-zinc-800/50 p-4 rounded border border-zinc-700">
                <h3 className="text-red-400 font-bold uppercase mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Equipo Visitante</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Nombre Completo</label>
                        <input 
                            value={config.awayTeam.name}
                            onChange={(e) => updateTeam('AWAY', { name: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Alias (3 Letras)</label>
                            <input 
                                value={config.awayTeam.shortName}
                                onChange={(e) => updateTeam('AWAY', { shortName: e.target.value.substring(0,3).toUpperCase() })}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white text-center font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Color</label>
                            <input 
                                type="color"
                                value={config.awayTeam.primaryColor}
                                onChange={(e) => updateTeam('AWAY', { primaryColor: e.target.value })}
                                className="w-full h-9 bg-zinc-900 border border-zinc-700 rounded p-1 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Director Técnico</label>
                        <input 
                            value={config.awayTeam.coach}
                            onChange={(e) => updateTeam('AWAY', { coach: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRosterEditor = (side: 'HOME' | 'AWAY') => {
        const team = side === 'HOME' ? config.homeTeam : config.awayTeam;
        return (
            <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-700 rounded overflow-hidden">
                <div className={`p-2 font-bold text-xs uppercase flex justify-between items-center ${side === 'HOME' ? 'bg-blue-900/20 text-blue-400' : 'bg-red-900/20 text-red-400'}`}>
                    <span>Plantilla {team.name}</span>
                    <button onClick={() => addPlayer(side)} className="bg-zinc-800 p-1 rounded hover:bg-white hover:text-black transition-colors"><UserPlus className="w-3 h-3"/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {team.players.length === 0 && (
                        <div className="text-center text-zinc-500 text-xs py-4 italic">Sin jugadores registrados</div>
                    )}
                    {team.players.map((p, idx) => (
                        <div key={p.id} className="flex items-center gap-1 bg-zinc-800/50 p-1 rounded border border-zinc-800 hover:border-zinc-600">
                            <input 
                                type="number" 
                                value={p.number} 
                                onChange={(e) => updatePlayer(side, p.id, { number: parseInt(e.target.value) })}
                                className="w-8 bg-zinc-900 text-center text-xs text-white p-1 rounded font-mono" 
                                placeholder="#"
                            />
                            <input 
                                type="text" 
                                value={p.name} 
                                onChange={(e) => updatePlayer(side, p.id, { name: e.target.value })}
                                className="flex-1 bg-zinc-900 text-xs text-white p-1 rounded" 
                                placeholder="Nombre"
                            />
                            <select
                                value={p.status}
                                onChange={(e) => updatePlayer(side, p.id, { status: e.target.value as PlayerStatus })}
                                className={`text-[9px] font-bold p-1 rounded uppercase w-16 ${p.status === PlayerStatus.STARTER ? 'bg-green-900/50 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}
                            >
                                <option value={PlayerStatus.STARTER}>TITULAR</option>
                                <option value={PlayerStatus.SUB}>SUPLENTE</option>
                                <option value={PlayerStatus.RESERVE}>RESERVA</option>
                            </select>
                            <button onClick={() => removePlayer(side, p.id)} className="text-zinc-600 hover:text-red-500 p-1"><Trash2 className="w-3 h-3"/></button>
                        </div>
                    ))}
                </div>
                <div className="p-1 bg-zinc-950 text-[9px] text-zinc-500 text-center">
                    Titulares: {team.players.filter(p => p.status === PlayerStatus.STARTER).length}
                </div>
            </div>
        );
    }

    const renderStep3_Rosters = () => (
        <div className="h-full flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-400">Define alineaciones iniciales y suplentes. Esto alimenta los gráficos.</p>
                <div className="flex gap-2">
                    {/* Helper to load mock data for testing */}
                    <button 
                        onClick={() => {
                            setConfig(prev => ({
                                ...prev,
                                homeTeam: { ...prev.homeTeam, players: MOCK_TEAMS[0].players.map(p => ({...p, id: `h-${p.number}`, status: PlayerStatus.STARTER })) },
                                awayTeam: { ...prev.awayTeam, players: MOCK_TEAMS[1].players.map(p => ({...p, id: `a-${p.number}`, status: PlayerStatus.STARTER })) }
                            }))
                        }}
                        className="text-[9px] text-blue-400 hover:underline"
                    >
                        Cargar Demo
                    </button>
                </div>
            </div>
            <div className="flex-1 flex gap-4 overflow-hidden h-[300px]">
                {renderRosterEditor('HOME')}
                {renderRosterEditor('AWAY')}
            </div>
        </div>
    );

    const renderStep4_Officials = () => (
        <div className="space-y-4 animate-in slide-in-from-right">
            <div className="bg-zinc-800 p-4 rounded border border-zinc-700">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-zinc-300 font-bold uppercase text-sm">Cuerpo Arbitral</h3>
                    <button 
                        onClick={() => setConfig(prev => ({ ...prev, officials: [...prev.officials, { id: `off-${Date.now()}`, name: '', role: 'REFEREE' }] }))}
                        className="bg-zinc-700 text-xs px-2 py-1 rounded text-white hover:bg-zinc-600"
                    >
                        + Agregar
                    </button>
                </div>
                <div className="space-y-2">
                    {config.officials.map((off, idx) => (
                        <div key={off.id} className="flex gap-2">
                            <input 
                                value={off.name}
                                onChange={(e) => {
                                    const newOffs = [...config.officials];
                                    newOffs[idx].name = e.target.value;
                                    setConfig({...config, officials: newOffs});
                                }}
                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white"
                                placeholder="Nombre Oficial"
                            />
                            <select
                                value={off.role}
                                onChange={(e) => {
                                    const newOffs = [...config.officials];
                                    newOffs[idx].role = e.target.value as any;
                                    setConfig({...config, officials: newOffs});
                                }}
                                className="bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300"
                            >
                                <option value="REFEREE">Principal (Árbitro/Ampayer)</option>
                                <option value="JUDGE">Juez / Asistente</option>
                                <option value="VAR">VAR / Video</option>
                                <option value="LINE_JUDGE">Juez de Línea</option>
                            </select>
                            <button 
                                onClick={() => setConfig(prev => ({...prev, officials: prev.officials.filter(o => o.id !== off.id)}))}
                                className="text-zinc-500 hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {config.officials.length === 0 && <p className="text-zinc-500 text-xs italic text-center">Sin oficiales asignados</p>}
                </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 p-3 rounded flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="text-xs text-yellow-200/80">
                    <p className="font-bold mb-1">Verificación Previa:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>{config.metadata.leagueName ? '✅' : '❌'} Nombre de Liga/Torneo definido</li>
                        <li>{config.homeTeam.players.length > 0 ? '✅' : '❌'} Plantilla Local cargada</li>
                        <li>{config.awayTeam.players.length > 0 ? '✅' : '❌'} Plantilla Visitante cargada</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
                
                {/* HEADER */}
                <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-blue-500" /> Configuración de Evento
                        </h2>
                        <p className="text-xs text-zinc-500">Configura todos los datos antes de salir al aire.</p>
                    </div>
                    <button onClick={onClose}><Trash2 className="w-5 h-5 text-zinc-600 hover:text-red-500"/></button>
                </div>

                {/* STEPS INDICATOR */}
                <div className="flex border-b border-zinc-800 bg-zinc-900">
                    <button onClick={() => setStep(1)} className={`flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${step === 1 ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>1. General</button>
                    <button onClick={() => setStep(2)} className={`flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${step === 2 ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>2. Equipos</button>
                    <button onClick={() => setStep(3)} className={`flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${step === 3 ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>3. Plantillas</button>
                    <button onClick={() => setStep(4)} className={`flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${step === 4 ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>4. Oficiales</button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-6 overflow-y-auto bg-zinc-900">
                    {step === 1 && renderStep1_General()}
                    {step === 2 && renderStep2_Teams()}
                    {step === 3 && renderStep3_Rosters()}
                    {step === 4 && renderStep4_Officials()}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-between items-center">
                    <button 
                        onClick={() => setStep(prev => Math.max(1, prev - 1) as any)}
                        disabled={step === 1}
                        className="px-4 py-2 rounded text-xs font-bold uppercase text-zinc-400 hover:text-white disabled:opacity-50"
                    >
                        Atrás
                    </button>

                    {step < 4 ? (
                        <button 
                            onClick={() => setStep(prev => Math.min(4, prev + 1) as any)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase flex items-center gap-2"
                        >
                            Siguiente <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleFinish}
                            className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                        >
                            <Save className="w-4 h-4" /> Guardar y Finalizar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
