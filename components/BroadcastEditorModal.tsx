import React, { useState } from 'react';
import { BroadcastState } from '../types';
import { X, Type, User, Palette } from 'lucide-react';

interface BroadcastEditorModalProps {
    state: BroadcastState;
    onUpdate: (u: Partial<BroadcastState>) => void;
    onClose: () => void;
}

const BroadcastEditorModal: React.FC<BroadcastEditorModalProps> = ({ state, onUpdate, onClose }) => {
    const [localState, setLocalState] = useState(state);

    const handleSave = () => {
        onUpdate(localState);
        onClose();
    }

    const updateReferee = (idx: number, val: string) => {
        const newRefs = [...localState.refereeNames];
        newRefs[idx] = val;
        setLocalState({ ...localState, refereeNames: newRefs });
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-sm overflow-hidden shadow-2xl">
                 <div className="flex justify-between items-center p-3 border-b border-zinc-800 bg-zinc-950">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Type className="w-4 h-4 text-pink-500" /> Graphics Editor
                    </h3>
                    <button onClick={onClose}><X className="w-4 h-4 text-zinc-500 hover:text-white"/></button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Intro Config */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Match Intro Titles</label>
                        <input 
                            type="text" 
                            value={localState.introTitle}
                            onChange={(e) => setLocalState({...localState, introTitle: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-white"
                            placeholder="Main Title (e.g., GRAND FINAL)"
                        />
                        <input 
                            type="text" 
                            value={localState.introSubtitle}
                            onChange={(e) => setLocalState({...localState, introSubtitle: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-white"
                            placeholder="Subtitle (e.g., Live from London)"
                        />
                    </div>

                    {/* Referee Config */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Match Officials</label>
                        {localState.refereeNames.map((ref, idx) => (
                             <div key={idx} className="flex items-center gap-2">
                                <User className="w-4 h-4 text-zinc-600" />
                                <input 
                                    type="text"
                                    value={ref}
                                    onChange={(e) => updateReferee(idx, e.target.value)}
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded p-1.5 text-xs text-white"
                                    placeholder={`Official ${idx+1}`}
                                />
                             </div>
                        ))}
                    </div>

                    {/* STYLING CONFIG */}
                    <div className="border-t border-zinc-800 pt-3 space-y-3">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-2">
                            <Palette className="w-3 h-3" /> Appearance
                        </label>
                        
                        <div>
                            <div className="flex justify-between text-[9px] text-zinc-500 mb-1">
                                <span>Background Opacity</span>
                                <span>{(localState.graphicsOpacity || 0.9) * 100}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0.2" max="1" step="0.1"
                                value={localState.graphicsOpacity || 0.9}
                                onChange={(e) => setLocalState({...localState, graphicsOpacity: parseFloat(e.target.value)})}
                                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-500">Accent Color</span>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="color" 
                                    value={localState.graphicsColor || '#ec4899'}
                                    onChange={(e) => setLocalState({...localState, graphicsColor: e.target.value})}
                                    className="w-6 h-6 bg-transparent border-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            onClick={handleSave}
                            className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded uppercase text-xs"
                        >
                            Update Graphics
                        </button>
                    </div>
                </div>
                 {/* Branding Footer */}
                 <div className="bg-zinc-950 p-2 text-center text-[9px] text-zinc-600 border-t border-zinc-800">
                    Graphics Module • ChrisRey91
                </div>
            </div>
        </div>
    );
};

export default BroadcastEditorModal;