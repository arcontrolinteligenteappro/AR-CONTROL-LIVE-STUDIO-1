import React, { useState } from 'react';
import { CameraSource, ConnectionStatus, DeviceType, TransitionType } from '../types';
import { Signal, AlertTriangle, Smartphone, Camera, Disc, Video, Scissors, Layers, Sliders, Edit2, Check, PictureInPicture, Monitor } from 'lucide-react';

interface CameraMultiviewProps {
    cameras: CameraSource[];
    activeId: string;
    pipId: string | null; // Receive PiP State
    onSelect: (id: string, mode: 'PGM' | 'PIP') => void; // Update Handler
    transitionType: TransitionType;
    onSetTransition: (t: TransitionType) => void;
    onTake: () => void;
    onRename?: (id: string, name: string) => void;
}

const CameraMultiview: React.FC<CameraMultiviewProps> = ({ cameras, activeId, pipId, onSelect, transitionType, onSetTransition, onTake, onRename }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [assignmentMode, setAssignmentMode] = useState<'PGM' | 'PIP'>('PGM');

    const startEdit = (e: React.MouseEvent, cam: CameraSource) => {
        e.stopPropagation();
        setEditingId(cam.id);
        setEditName(cam.name);
    }

    const saveEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (editingId && onRename) {
            onRename(editingId, editName);
        }
        setEditingId(null);
    }
    
    const getIcon = (type: DeviceType) => {
        switch (type) {
          case DeviceType.DRONE: return <Disc className="w-3 h-3" />;
          case DeviceType.SMARTPHONE: return <Smartphone className="w-3 h-3" />;
          case DeviceType.GOPRO: return <Camera className="w-3 h-3" />;
          default: return <Video className="w-3 h-3" />;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Bus & Transition Control Bar */}
            <div className="flex flex-col gap-1 px-2 py-2 bg-zinc-900 border-b border-zinc-800">
                
                {/* BUS SELECTION (Professional Switcher Logic) */}
                <div className="flex items-center justify-between mb-1">
                    <div className="flex bg-zinc-800 p-0.5 rounded">
                        <button 
                            onClick={() => setAssignmentMode('PGM')}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-[10px] font-black uppercase transition-all ${assignmentMode === 'PGM' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Monitor className="w-3 h-3" /> PGM
                        </button>
                        <button 
                            onClick={() => setAssignmentMode('PIP')}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-[10px] font-black uppercase transition-all ${assignmentMode === 'PIP' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <PictureInPicture className="w-3 h-3" /> PiP
                        </button>
                    </div>
                    {/* Auto Take Button */}
                    <button 
                        onClick={onTake}
                        className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all"
                    >
                        CUT / TAKE
                    </button>
                </div>

                {/* TRANSITIONS */}
                <div className="flex gap-1">
                    <button 
                        onClick={() => onSetTransition(TransitionType.CUT)}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase border transition-all ${transitionType === TransitionType.CUT ? 'bg-zinc-700 border-zinc-500 text-white' : 'bg-zinc-800 border-zinc-800 text-zinc-500'}`}
                    >
                        <Scissors className="w-3 h-3" /> Cut
                    </button>
                    <button 
                        onClick={() => onSetTransition(TransitionType.MIX)}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase border transition-all ${transitionType === TransitionType.MIX ? 'bg-zinc-700 border-zinc-500 text-white' : 'bg-zinc-800 border-zinc-800 text-zinc-500'}`}
                    >
                        <Sliders className="w-3 h-3" /> Mix
                    </button>
                    <button 
                        onClick={() => onSetTransition(TransitionType.WIPE)}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase border transition-all ${transitionType === TransitionType.WIPE ? 'bg-zinc-700 border-zinc-500 text-white' : 'bg-zinc-800 border-zinc-800 text-zinc-500'}`}
                    >
                        <Layers className="w-3 h-3" /> Wipe
                    </button>
                </div>
            </div>

            {/* Cameras Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-2 px-2 h-full items-center custom-scrollbar touch-pan-x bg-zinc-950">
                {cameras.map((cam, idx) => {
                    const isActive = cam.id === activeId; // Is Program
                    const isPip = cam.id === pipId; // Is PiP
                    const isLost = cam.status === ConnectionStatus.LOST;
                    const isEditing = editingId === cam.id;

                    return (
                        <div
                            key={cam.id}
                            onClick={() => !isLost && !isEditing && onSelect(cam.id, assignmentMode)}
                            className={`relative shrink-0 w-40 h-24 rounded-lg overflow-hidden border-2 transition-all group cursor-pointer shadow-md ${
                                isActive 
                                    ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105 z-10' 
                                    : (isPip ? 'border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] z-10' : 'border-zinc-800 hover:border-zinc-500 opacity-80 hover:opacity-100')
                            } ${isLost ? 'opacity-40 grayscale' : ''}`}
                        >
                            {/* Hotkey Indicator */}
                            <div className="absolute top-1 left-1 z-20 bg-black/80 w-4 h-4 flex items-center justify-center rounded text-[9px] font-mono text-white border border-white/20">
                                {idx + 1}
                            </div>
                            
                            {/* Rename Button */}
                            {!isEditing && (
                                <button 
                                    onClick={(e) => startEdit(e, cam)}
                                    className="absolute top-1 right-12 z-20 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-blue-600 text-white transition-all"
                                >
                                    <Edit2 className="w-2.5 h-2.5" />
                                </button>
                            )}

                            {/* Background Thumbnail */}
                            <img src={cam.thumbnailUrl} alt={cam.name} className="w-full h-full object-cover" />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                            {/* Status Label (Top Right) */}
                            <div className="absolute top-1 right-1 flex gap-1">
                                {isPip && (
                                    <div className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                        PIP
                                    </div>
                                )}
                                {isLost ? (
                                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                                ) : (
                                    <div className="flex items-center gap-1 bg-black/60 px-1.5 rounded-full">
                                        <Signal className={`w-2 h-2 ${cam.signalStrength < 40 ? 'text-red-500' : 'text-green-500'}`} />
                                    </div>
                                )}
                            </div>

                            {/* Camera Name (Bottom) */}
                            <div className="absolute bottom-0 left-0 right-0 p-1.5 flex items-center gap-1.5 z-30 bg-black/40 backdrop-blur-sm">
                                <div className={`p-1 rounded bg-zinc-800 text-zinc-300`}>
                                    {getIcon(cam.type)}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    {isEditing ? (
                                        <div className="flex items-center gap-1">
                                            <input 
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full bg-zinc-800 text-white text-[10px] px-1 rounded border border-blue-500 outline-none"
                                                autoFocus
                                            />
                                            <button onClick={saveEdit} className="bg-green-600 p-0.5 rounded text-black"><Check className="w-3 h-3"/></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-[10px] font-bold text-white truncate leading-none">{cam.name}</div>
                                            <div className="text-[8px] text-zinc-400 font-mono mt-0.5 flex gap-2">
                                                <span>{cam.stats.bitrate.toFixed(1)}M</span>
                                                <span className="opacity-50">{cam.stats.resolution || '1080p'}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Tally Indicator (Only Program) */}
                            {isActive && (
                                <div className="absolute inset-0 border-4 border-red-600 rounded-lg pointer-events-none animate-pulse"></div>
                            )}
                        </div>
                    )
                })}
                
                {/* Add Source Placeholder */}
                <div className="shrink-0 w-20 h-24 rounded-lg border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600">
                    <span className="text-[9px] font-bold uppercase text-center px-1">Add Cam</span>
                </div>
            </div>
        </div>
    );
};

export default CameraMultiview;