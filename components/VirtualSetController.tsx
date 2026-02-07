import React, { useState } from 'react';
import { VirtualSetState, VirtualSetPreset } from '../types';
import { generateStudioAdvice, generateSetImageDescription } from '../services/geminiService';
import { Image, Sparkles, Wand2, Lightbulb, Save, Sliders, Box, Mic, Camera, Video } from 'lucide-react';

interface VirtualSetControllerProps {
    state: VirtualSetState;
    onUpdate: (updates: Partial<VirtualSetState>) => void;
}

const DEFAULT_PRESETS: VirtualSetPreset[] = [
    { id: 'set-1', name: 'Estilo ESPN', imageUrl: 'https://picsum.photos/seed/espn/800/450', category: 'SPORT' },
    { id: 'set-soccer', name: 'Estadio Noche', imageUrl: 'https://picsum.photos/seed/stadiumnight/800/450', category: 'SPORT' },
    { id: 'set-locker', name: 'Vestidores', imageUrl: 'https://picsum.photos/seed/lockerroom/800/450', category: 'SPORT' },
    { id: 'set-desk', name: 'Mesa Noticias', imageUrl: 'https://picsum.photos/seed/newsdesk/800/450', category: 'NEWS' },
    { id: 'set-2', name: 'Loft Podcast', imageUrl: 'https://picsum.photos/seed/loft/800/450', category: 'PODCAST' },
    { id: 'set-abstract', name: 'Deportes Neón', imageUrl: 'https://picsum.photos/seed/neonsports/800/450', category: 'ABSTRACT' },
];

const VirtualSetController: React.FC<VirtualSetControllerProps> = ({ state, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'SETS' | 'AI' | 'COACH'>('SETS');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Función para generar y guardar automáticamente el set
    const handleGenerateSet = async () => {
        setIsGenerating(true);
        // 1. Obtener descripción visual de Gemini
        const keywords = await generateSetImageDescription(state.aiPrompt);
        // 2. Simular generación de imagen
        const newUrl = `https://picsum.photos/seed/${keywords.replace(/\s/g, '')}/800/450`;
        
        const newPreset: VirtualSetPreset = {
            id: `gen-${Date.now()}`,
            name: `AI: ${state.aiPrompt.substring(0, 15)}...`,
            imageUrl: newUrl,
            category: 'ABSTRACT'
        };

        // Guardar en la lista de presets
        onUpdate({ 
            presets: [newPreset, ...state.presets],
            currentBackgroundId: newPreset.id,
            isEnabled: true // Activar automáticamente
        });
        setIsGenerating(false);
        setActiveTab('SETS'); // Volver a la galería para ver el resultado
    };

    const handleGetCoaching = async (context: string) => {
        setIsGenerating(true);
        const tips = await generateStudioAdvice(context);
        onUpdate({ coachTips: tips });
        setIsGenerating(false);
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
             <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                    <Box className="w-3.5 h-3.5 text-green-500" /> Estudio Virtual
                </h3>
                <div className="flex items-center gap-1">
                    <span className="text-[9px] text-zinc-600 font-mono">Motor Chroma</span>
                    <button 
                        onClick={() => onUpdate({ isEnabled: !state.isEnabled })}
                        className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${state.isEnabled ? 'bg-green-500 justify-end' : 'bg-zinc-700 justify-start'}`}
                    >
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-3 border-b border-zinc-800">
                <button onClick={() => setActiveTab('SETS')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase ${activeTab === 'SETS' ? 'text-green-400 border-b-2 border-green-500' : 'text-zinc-500'}`}>Galería</button>
                <button onClick={() => setActiveTab('AI')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase ${activeTab === 'AI' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-zinc-500'}`}>Generar IA</button>
                <button onClick={() => setActiveTab('COACH')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase ${activeTab === 'COACH' ? 'text-yellow-400 border-b-2 border-yellow-500' : 'text-zinc-500'}`}>Coach IA</button>
            </div>

            {activeTab === 'SETS' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {[...DEFAULT_PRESETS, ...state.presets].map(preset => (
                            <button 
                                key={preset.id}
                                onClick={() => onUpdate({ currentBackgroundId: preset.id, isEnabled: true })}
                                className={`relative aspect-video rounded overflow-hidden border-2 transition-all group ${state.currentBackgroundId === preset.id ? 'border-green-500' : 'border-transparent hover:border-zinc-500'}`}
                            >
                                <img src={preset.imageUrl} alt={preset.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-end p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] text-white font-bold truncate">{preset.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    {state.isEnabled && (
                        <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                                <Sliders className="w-3 h-3 text-zinc-500" />
                                <span className="text-[10px] text-zinc-400 uppercase">Umbral de Pantalla Verde</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={state.chromaThreshold}
                                onChange={(e) => onUpdate({ chromaThreshold: parseInt(e.target.value) })}
                                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'AI' && (
                <div className="space-y-2">
                    <textarea 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white resize-none h-16 outline-none focus:border-purple-500"
                        placeholder="Describe tu set (ej: Estadio futurista con luces neón rojas)"
                        value={state.aiPrompt}
                        onChange={(e) => onUpdate({ aiPrompt: e.target.value })}
                    />
                    <button 
                        onClick={handleGenerateSet}
                        disabled={isGenerating || !state.aiPrompt}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2"
                    >
                        {isGenerating ? <Sparkles className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3"/>}
                        Generar y Usar
                    </button>
                    <p className="text-[9px] text-zinc-500 text-center">La imagen se guardará automáticamente en la Galería.</p>
                </div>
            )}

            {activeTab === 'COACH' && (
                <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500">Solicita consejos de dirección a la IA:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => handleGetCoaching('entrevista deportiva postura y encuadre')}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded text-[9px] font-bold uppercase border border-zinc-700 flex flex-col items-center gap-1"
                        >
                            <Mic className="w-3 h-3 text-blue-400" /> Entrevistas
                        </button>
                        <button 
                            onClick={() => handleGetCoaching('iluminación para estudio deportivo')}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded text-[9px] font-bold uppercase border border-zinc-700 flex flex-col items-center gap-1"
                        >
                            <Lightbulb className="w-3 h-3 text-yellow-400" /> Iluminación
                        </button>
                        <button 
                            onClick={() => handleGetCoaching('mejores angulos camara futbol')}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded text-[9px] font-bold uppercase border border-zinc-700 flex flex-col items-center gap-1"
                        >
                            <Camera className="w-3 h-3 text-green-400" /> Ángulos
                        </button>
                        <button 
                            onClick={() => handleGetCoaching('calidad de audio streaming')}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded text-[9px] font-bold uppercase border border-zinc-700 flex flex-col items-center gap-1"
                        >
                            <Video className="w-3 h-3 text-red-400" /> Check Audio
                        </button>
                    </div>

                    <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar bg-black/20 p-1 rounded">
                        {isGenerating ? (
                            <div className="text-center py-4 text-xs text-zinc-500 flex items-center justify-center gap-2">
                                <Sparkles className="w-3 h-3 animate-spin text-yellow-500"/> Consultando Director IA...
                            </div>
                        ) : state.coachTips.length > 0 ? (
                            state.coachTips.map((tip, idx) => (
                                <div key={idx} className="bg-yellow-900/10 border border-yellow-700/30 p-2 rounded flex gap-2 items-start animate-in fade-in slide-in-from-bottom-1">
                                    <Lightbulb className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-zinc-300 leading-tight">{tip}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] text-zinc-600 text-center italic mt-2">Selecciona un tema para recibir consejos profesionales.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualSetController;