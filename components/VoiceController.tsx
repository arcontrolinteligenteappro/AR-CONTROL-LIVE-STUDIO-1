
import React, { useState, useEffect } from 'react';
import { VoiceState, VoiceProfile } from '../types';
import { Mic, Play, Volume2, Globe, Sparkles, MessageSquare, History } from 'lucide-react';
import { VOICE_PROFILES } from '../constants';
import { speakText, getSystemVoices } from '../services/VoiceEngine';

interface VoiceControllerProps {
    state: VoiceState;
    onUpdate: (updates: Partial<VoiceState>) => void;
}

const VoiceController: React.FC<VoiceControllerProps> = ({ state, onUpdate }) => {
    const [text, setText] = useState('');
    const [localProfiles, setLocalProfiles] = useState<VoiceProfile[]>(VOICE_PROFILES);

    // Initial Load of System Voices
    useEffect(() => {
        getSystemVoices().then(sysVoices => {
            if (sysVoices.length > 0) {
                // Merge constants with detected system voices
                setLocalProfiles([...VOICE_PROFILES, ...sysVoices.slice(0, 5)]); // Limit to 5 sys voices
            }
        });
    }, []);

    const handleSpeak = async () => {
        if (!text) return;
        
        onUpdate({ isSpeaking: true });
        
        // Add to history
        const newHistory = [text, ...state.history].slice(0, 5);
        onUpdate({ history: newHistory });

        await speakText(text, state.selectedVoiceId, localProfiles);
        
        onUpdate({ isSpeaking: false });
        setText('');
    };

    const handleQuickPhrase = (phrase: string) => {
        setText(phrase);
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2 shrink-0">
                <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-blue-500" /> AI Voice Engine
                </h3>
                {state.isSpeaking && (
                    <div className="flex gap-0.5 items-end h-3">
                        <div className="w-1 bg-blue-500 animate-[bounce_0.5s_infinite] h-2"></div>
                        <div className="w-1 bg-blue-500 animate-[bounce_0.5s_infinite_0.1s] h-3"></div>
                        <div className="w-1 bg-blue-500 animate-[bounce_0.5s_infinite_0.2s] h-2"></div>
                    </div>
                )}
            </div>

            {/* Profile Selector */}
            <div className="mb-3 shrink-0">
                <label className="text-[9px] font-bold text-zinc-500 uppercase mb-1 block">Voz Activa</label>
                <select 
                    value={state.selectedVoiceId}
                    onChange={(e) => onUpdate({ selectedVoiceId: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-blue-500"
                >
                    {localProfiles.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.provider === 'CLOUD_AI' ? '☁️ ' : '💻 '} {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Text Input */}
            <div className="flex-1 flex flex-col gap-2 min-h-0">
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe para narrar..."
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white resize-none outline-none focus:border-blue-500"
                />
                
                <button 
                    onClick={handleSpeak}
                    disabled={state.isSpeaking || !text}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded uppercase text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Play className="w-4 h-4 fill-current" /> Hablar
                </button>
            </div>

            {/* Quick Phrases */}
            <div className="mt-3 shrink-0">
                <span className="text-[9px] font-bold text-zinc-500 uppercase mb-1 block">Frases Rápidas</span>
                <div className="grid grid-cols-2 gap-2">
                    {["¡Gol!", "¡Increíble jugada!", "Bienvenidos a la transmisión", "Oferta por tiempo limitado"].map((phrase, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleQuickPhrase(phrase)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 px-2 rounded text-[10px] truncate border border-zinc-700 text-left"
                        >
                            {phrase}
                        </button>
                    ))}
                </div>
            </div>

            {/* History */}
            {state.history.length > 0 && (
                <div className="mt-3 pt-2 border-t border-zinc-800 shrink-0">
                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase mb-1">
                        <History className="w-3 h-3" /> Historial
                    </div>
                    <div className="space-y-1">
                        {state.history.slice(0, 2).map((h, i) => (
                            <div key={i} onClick={() => setText(h)} className="text-[10px] text-zinc-400 truncate hover:text-white cursor-pointer bg-zinc-950 p-1 rounded">
                                {h}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceController;
