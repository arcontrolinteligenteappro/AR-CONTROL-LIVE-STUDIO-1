import React, { useState, useEffect } from 'react';
import { ExternalMonitorState } from '../types';
import { Monitor, Cast, X, CheckCircle, Wifi, Cable, MessageSquare, LayoutTemplate, Activity } from 'lucide-react';

interface ExternalMonitorModalProps {
    state: ExternalMonitorState;
    onUpdate: (updates: Partial<ExternalMonitorState>) => void;
    onClose: () => void;
}

const ExternalMonitorModal: React.FC<ExternalMonitorModalProps> = ({ state, onUpdate, onClose }) => {
    
    // Simulate connection search
    useEffect(() => {
        let timer: any;
        if (state.status === 'SEARCHING') {
            timer = setTimeout(() => {
                onUpdate({ status: 'CONNECTED', deviceName: 'Samsung Studio Display 4K' });
            }, 2500);
        }
        return () => clearTimeout(timer);
    }, [state.status]);

    const handleConnect = (mode: 'WIRELESS_CAST' | 'HDMI_WIRED') => {
        onUpdate({ 
            isEnabled: true, 
            mode: mode, 
            status: 'SEARCHING',
            latencyMs: mode === 'WIRELESS_CAST' ? 85 : 5 
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-blue-500" /> Monitor de Confianza
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>

                <div className="p-6">
                    {state.status === 'DISCONNECTED' && (
                        <div className="space-y-3">
                            <p className="text-zinc-400 text-xs mb-4">
                                Conecta una pantalla externa para tus entrevistados. Esta señal evita el encoder principal para asegurar baja latencia.
                            </p>
                            
                            <button 
                                onClick={() => handleConnect('WIRELESS_CAST')}
                                className="w-full flex items-center justify-between bg-zinc-800 p-3 rounded border border-zinc-700 hover:border-blue-500 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded group-hover:bg-purple-500/20">
                                        <Cast className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-bold text-sm">Proyección Inalámbrica</div>
                                        <div className="text-zinc-500 text-[10px]">Chromecast / AirPlay • ~85ms</div>
                                    </div>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleConnect('HDMI_WIRED')}
                                className="w-full flex items-center justify-between bg-zinc-800 p-3 rounded border border-zinc-700 hover:border-blue-500 group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded group-hover:bg-blue-500/20">
                                        <Cable className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-bold text-sm">Cableado (HDMI/SDI)</div>
                                        <div className="text-zinc-500 text-[10px]">Conexión Directa • Latencia Cero</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                    {state.status === 'SEARCHING' && (
                        <div className="text-center py-8">
                            <Wifi className="w-12 h-12 text-blue-500 animate-ping mx-auto mb-4" />
                            <p className="text-white font-bold">Buscando pantallas...</p>
                            <p className="text-zinc-500 text-xs mt-1">Asegúrate que el dispositivo sea visible</p>
                        </div>
                    )}

                    {state.status === 'CONNECTED' && (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Monitor Activo</h3>
                                <p className="text-blue-400 text-xs font-mono mt-1">{state.deviceName}</p>
                            </div>
                            
                            <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-left">
                                <span className="text-[9px] text-zinc-500 uppercase font-bold block mb-2 px-1">Modo de Visualización</span>
                                <div className="grid grid-cols-3 gap-1">
                                    <button 
                                        onClick={() => onUpdate({ viewMode: 'PROGRAM_MIRROR' })}
                                        className={`flex flex-col items-center p-2 rounded ${state.viewMode === 'PROGRAM_MIRROR' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        <LayoutTemplate className="w-4 h-4 mb-1" />
                                        <span className="text-[8px] uppercase">Espejo</span>
                                    </button>
                                    <button 
                                        onClick={() => onUpdate({ viewMode: 'SOCIAL_FEED' })}
                                        className={`flex flex-col items-center p-2 rounded ${state.viewMode === 'SOCIAL_FEED' ? 'bg-pink-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        <MessageSquare className="w-4 h-4 mb-1" />
                                        <span className="text-[8px] uppercase">Redes</span>
                                    </button>
                                    <button 
                                        onClick={() => onUpdate({ viewMode: 'STATS' })}
                                        className={`flex flex-col items-center p-2 rounded ${state.viewMode === 'STATS' ? 'bg-yellow-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        <Activity className="w-4 h-4 mb-1" />
                                        <span className="text-[8px] uppercase">Stats</span>
                                    </button>
                                </div>
                            </div>

                            {/* Self View Toggle (Only relevant for Mirror) */}
                            {state.viewMode === 'PROGRAM_MIRROR' && (
                                <div className="flex items-center justify-between bg-zinc-800 p-3 rounded">
                                    <span className="text-xs text-zinc-300">Espejo (Selfie)</span>
                                    <button 
                                        onClick={() => onUpdate({ showSelfView: !state.showSelfView })}
                                        className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${state.showSelfView ? 'bg-blue-600 justify-end' : 'bg-zinc-600 justify-start'}`}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                    </button>
                                </div>
                            )}

                            {/* Preview of Social Feed Logic (Mock visual) */}
                            {state.viewMode === 'SOCIAL_FEED' && (
                                <div className="bg-zinc-950 p-2 rounded border border-pink-900/50 text-left">
                                    <div className="text-[9px] text-pink-500 font-bold uppercase mb-1">Vista Previa: Salida Monitor</div>
                                    <div className="space-y-1">
                                        <div className="bg-zinc-900 p-1.5 rounded text-[10px] text-zinc-400">User1: ¡Gran partido!</div>
                                        <div className="bg-zinc-900 p-1.5 rounded text-[10px] text-zinc-400">User2: El árbitro no vió eso...</div>
                                        <div className="bg-zinc-900 p-1.5 rounded text-[10px] text-zinc-400">User3: #Gol</div>
                                    </div>
                                </div>
                            )}

                            {/* MONITOR BRANDING (Not sent to PGM) */}
                            <div className="mt-4 pt-4 border-t border-zinc-800 text-center opacity-60">
                                <div className="text-[9px] text-zinc-400">Salida Monitor Auxiliar</div>
                                <div className="text-[10px] text-zinc-300 font-bold mt-1">Desarrollado por ChrisRey91</div>
                                <div className="text-[8px] text-blue-400">www.arcontrolinteligente.com</div>
                            </div>

                            <button 
                                onClick={() => onUpdate({ status: 'DISCONNECTED', isEnabled: false })}
                                className="w-full py-2 bg-red-900/30 text-red-500 hover:bg-red-900/50 border border-red-900 rounded text-xs font-bold uppercase"
                            >
                                Desconectar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExternalMonitorModal;