
import React, { useState, useEffect } from 'react';
import { StreamingState, RecordingState, StreamPlatform, BroadcastPhase } from '../types';
import { Cast, Radio, StopCircle, Globe, Smartphone, Monitor, Youtube, Twitch, Facebook, Video, Disc, Save, PlaySquare, Hourglass, Check, Eye, Users } from 'lucide-react';

interface StreamingControllerProps {
    state: StreamingState;
    onUpdate: (updates: Partial<StreamingState>) => void;
    recordingState?: RecordingState;
    onToggleRecording?: () => void;
    onPlatformClick?: (platform: StreamPlatform) => void; 
}

const StreamingController: React.FC<StreamingControllerProps> = ({ state, onUpdate, recordingState, onToggleRecording, onPlatformClick }) => {
    
    useEffect(() => {
        let interval: any;
        if (state.isStreaming && state.broadcastPhase === BroadcastPhase.LIVE) {
            interval = setInterval(() => {
                onUpdate({ uptime: state.uptime + 1 });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [state.isStreaming, state.broadcastPhase, state.uptime]);

    const handleGoLive = () => {
        if (!state.isStreaming) {
            if (state.activeDestinations.length === 0) {
                alert("Por favor selecciona al menos un destino e inicia sesión.");
                return;
            }
            onUpdate({ isStreaming: true, health: 'POOR', broadcastPhase: BroadcastPhase.PRE_SHOW });
            setTimeout(() => onUpdate({ health: 'EXCELLENT' }), 2000);
        } else {
            onUpdate({ isStreaming: false, uptime: 0, health: 'OFFLINE', broadcastPhase: BroadcastPhase.PRE_SHOW, viewers: { total: 0, platforms: { youtube: 0, facebook: 0, twitch: 0, tiktok: 0, rtmp: 0 }} });
        }
    };

    const triggerCountdown = () => {
        onUpdate({ broadcastPhase: BroadcastPhase.COUNTDOWN });
    }

    const triggerOutro = () => {
        onUpdate({ broadcastPhase: BroadcastPhase.POST_SHOW });
    }

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Corrected assignments using the StreamPlatform enum
    const platforms: { id: StreamPlatform, icon: any, label: string, color: string }[] = [
        { id: StreamPlatform.YOUTUBE, icon: Youtube, label: 'YouTube', color: 'text-red-500 border-red-500/50' },
        { id: StreamPlatform.TWITCH, icon: Twitch, label: 'Twitch', color: 'text-purple-500 border-purple-500/50' },
        { id: StreamPlatform.TIKTOK, icon: Disc, label: 'TikTok', color: 'text-cyan-400 border-cyan-500/50' },
        { id: StreamPlatform.FACEBOOK, icon: Facebook, label: 'Facebook', color: 'text-blue-500 border-blue-500/50' },
        { id: StreamPlatform.CUSTOM_RTMP, icon: Globe, label: 'RTMP', color: 'text-zinc-400 border-zinc-500/50' },
    ];

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
             <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                    <Cast className="w-3.5 h-3.5 text-purple-500" /> Control de Transmisión
                </h3>
                <div className={`w-2 h-2 rounded-full ${state.isStreaming ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`}></div>
            </div>

            {/* Platform Selector (Multi-Select) */}
            <div className="mb-3">
                <label className="text-[9px] text-zinc-500 uppercase font-bold mb-1 block">Destinos Activos</label>
                <div className="grid grid-cols-5 gap-1">
                    {platforms.map(p => {
                        const isActive = state.activeDestinations?.includes(p.id);
                        return (
                            <button
                                key={p.id}
                                onClick={() => onPlatformClick ? onPlatformClick(p.id) : null}
                                disabled={state.isStreaming}
                                className={`flex flex-col items-center justify-center p-2 rounded border transition-all relative ${
                                    isActive 
                                        ? `bg-zinc-800 ${p.color} shadow-lg` 
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-600 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <p.icon className="w-4 h-4 mb-1" />
                                {isActive && <div className="absolute top-0 right-0 p-0.5 bg-green-500 rounded-bl"><Check className="w-2 h-2 text-black"/></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* VIEWER ANALYTICS PANEL (New) */}
            {state.isStreaming && (
                <div className="mb-3 bg-zinc-950 rounded p-2 border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Audiencia en Vivo</span>
                        <span className="text-xs font-bold text-white ml-auto">{state.viewers.total.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[9px] text-zinc-500 font-mono">
                        {state.activeDestinations.includes(StreamPlatform.YOUTUBE) && (
                            <div className="flex justify-between items-center bg-zinc-900 px-2 py-1 rounded">
                                <span className="text-red-500">YouTube</span>
                                <span>{state.viewers.platforms.youtube}</span>
                            </div>
                        )}
                        {state.activeDestinations.includes(StreamPlatform.FACEBOOK) && (
                            <div className="flex justify-between items-center bg-zinc-900 px-2 py-1 rounded">
                                <span className="text-blue-500">Facebook</span>
                                <span>{state.viewers.platforms.facebook}</span>
                            </div>
                        )}
                        {state.activeDestinations.includes(StreamPlatform.TWITCH) && (
                            <div className="flex justify-between items-center bg-zinc-900 px-2 py-1 rounded">
                                <span className="text-purple-500">Twitch</span>
                                <span>{state.viewers.platforms.twitch}</span>
                            </div>
                        )}
                        {state.activeDestinations.includes(StreamPlatform.TIKTOK) && (
                            <div className="flex justify-between items-center bg-zinc-900 px-2 py-1 rounded">
                                <span className="text-cyan-400">TikTok</span>
                                <span>{state.viewers.platforms.tiktok}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Broadcast Workflow Buttons */}
            {state.isStreaming && (
                <div className="grid grid-cols-3 gap-1 mb-3">
                     <button 
                        onClick={() => onUpdate({ broadcastPhase: BroadcastPhase.PRE_SHOW })}
                        className={`py-2 rounded text-[9px] font-bold uppercase border ${state.broadcastPhase === BroadcastPhase.PRE_SHOW ? 'bg-blue-600 text-white border-blue-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                    >
                        1. Intro
                    </button>
                     <button 
                        onClick={triggerCountdown}
                        className={`py-2 rounded text-[9px] font-bold uppercase border ${state.broadcastPhase === BroadcastPhase.COUNTDOWN ? 'bg-orange-600 text-white border-orange-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                    >
                        2. Cuenta Regresiva
                    </button>
                     <button 
                        onClick={triggerOutro}
                        className={`py-2 rounded text-[9px] font-bold uppercase border ${state.broadcastPhase === BroadcastPhase.POST_SHOW ? 'bg-red-600 text-white border-red-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                    >
                        3. Cierre
                    </button>
                </div>
            )}

            {/* Stream Stats Bar */}
            {state.isStreaming && (
                <div className="flex items-center justify-between bg-zinc-950 p-2 rounded mb-3 border border-zinc-800">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-500 uppercase">Tiempo al Aire</span>
                        <span className="text-sm font-mono font-bold text-white">{formatUptime(state.uptime)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-zinc-500 uppercase">Fase</span>
                        <span className={`text-[10px] font-bold px-1.5 rounded ${
                            state.broadcastPhase === BroadcastPhase.LIVE ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                            {state.broadcastPhase}
                        </span>
                    </div>
                </div>
            )}

            {/* Master Controls */}
            <div className="grid grid-cols-2 gap-2">
                 <button 
                    onClick={onToggleRecording}
                    className={`py-3 rounded font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                        recordingState?.isRecording
                            ? 'bg-zinc-200 text-red-600 hover:bg-white animate-pulse'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                >
                    {recordingState?.isRecording ? <Save className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {recordingState?.isRecording ? 'Parar REC' : 'Grabar ISO'}
                </button>

                <button 
                    onClick={handleGoLive}
                    className={`py-3 rounded font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                        state.isStreaming 
                            ? 'bg-red-900/80 text-white hover:bg-red-800' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                    }`}
                >
                    {state.isStreaming ? <><StopCircle className="w-4 h-4"/> Finalizar</> : <><Radio className="w-4 h-4"/> Conectar</>}
                </button>
            </div>
            
            {state.isStreaming && state.broadcastPhase === BroadcastPhase.PRE_SHOW && (
                <button 
                    onClick={() => onUpdate({ broadcastPhase: BroadcastPhase.LIVE })}
                    className="w-full mt-2 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-xs uppercase"
                >
                    Cortar a En Vivo (Saltar Intro)
                </button>
            )}
        </div>
    );
};

export default StreamingController;