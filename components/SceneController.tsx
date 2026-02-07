import React, { useState } from 'react';
import { SceneAsset, SceneAudioMode } from '../types';
import { Image, Video, PlayCircle, Mic, MicOff, Settings2, Plus, Music, Trash2, X, Upload } from 'lucide-react';

interface SceneControllerProps {
    assets: SceneAsset[];
    activeAssetId: string | null;
    onSelectAsset: (asset: SceneAsset | null) => void;
    onAddAsset: (asset: SceneAsset) => void;
    onDeleteAsset: (id: string) => void;
    sceneAudioMode: SceneAudioMode;
    onToggleAudioMode: () => void;
}

const SceneController: React.FC<SceneControllerProps> = ({ 
    assets, activeAssetId, onSelectAsset, onAddAsset, onDeleteAsset, 
    sceneAudioMode, onToggleAudioMode 
}) => {
    
    const [showAddModal, setShowAddModal] = useState(false);
    
    // New Asset Form State
    const [newType, setNewType] = useState<'AD' | 'INTRO' | 'AUDIO'>('AD');
    const [newName, setNewName] = useState('');
    const [newDuration, setNewDuration] = useState(15);
    const [newLoop, setNewLoop] = useState(false);

    const isMixMode = sceneAudioMode === SceneAudioMode.MIX_LIVE;

    const handleAdd = () => {
        const asset: SceneAsset = {
            id: `scene-${Date.now()}`,
            type: newType,
            name: newName || 'Sin Título',
            thumbnailUrl: newType === 'AUDIO' ? 'https://picsum.photos/seed/audio/300/200' : 'https://picsum.photos/seed/video/300/200',
            duration: newDuration,
            loop: newLoop,
            volume: 100
        };
        onAddAsset(asset);
        setShowAddModal(false);
        setNewName('');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
             {/* Scene Controls Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Escenas</span>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-1 rounded"
                        title="Añadir Escena / Media"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    {/* Audio Mode Toggle */}
                    <button 
                        onClick={onToggleAudioMode}
                        className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all border ${
                            isMixMode 
                            ? 'bg-blue-900/30 text-blue-400 border-blue-500/50' 
                            : 'bg-red-900/30 text-red-400 border-red-500/50'
                        }`}
                        title={isMixMode ? "Los micrófonos siguen ABIERTOS durante comerciales" : "Micrófonos MUTADOS durante comerciales"}
                    >
                        {isMixMode ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                        {isMixMode ? 'Mics: EN VIVO' : 'Mics: OFF'}
                    </button>
                </div>
            </div>

            {/* Assets Strip */}
            <div className="flex-1 flex gap-4 items-center px-4 overflow-x-auto custom-scrollbar">
                
                <button 
                    onClick={() => onSelectAsset(null)}
                    className={`shrink-0 w-32 h-24 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${activeAssetId === null ? 'bg-red-600 border-red-400 text-white shadow-lg' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                    <span className="font-black uppercase text-sm">CÁMARA</span>
                    <span className="text-[9px] mt-1 font-mono">{isMixMode ? 'AUDIO: PGM' : 'AUDIO: RESTORE'}</span>
                </button>

                <div className="w-px h-16 bg-zinc-800 mx-2"></div>

                {assets.map(asset => {
                    const isActive = asset.id === activeAssetId;
                    return (
                        <div key={asset.id} className="relative group">
                            <button 
                                onClick={() => onSelectAsset(asset)}
                                className={`relative shrink-0 w-40 h-24 rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${
                                    isActive ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-zinc-700 hover:border-zinc-500'
                                }`}
                            >
                                <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {asset.type === 'AUDIO' ? (
                                        <Music className={`w-8 h-8 ${isActive ? 'text-white animate-pulse' : 'text-white/70'}`} />
                                    ) : (asset.type === 'AD' || asset.type === 'INTRO' ? (
                                        <PlayCircle className={`w-8 h-8 ${isActive ? 'text-white' : 'text-white/70'}`} />
                                    ) : (
                                        <Image className="w-6 h-6 text-white/50" />
                                    ))}
                                </div>

                                <div className="absolute top-1 right-1 bg-black/70 px-1.5 rounded text-[9px] font-bold text-white uppercase flex items-center gap-1">
                                    {asset.duration}s {asset.loop && '∞'}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1.5 text-[10px] font-bold text-white truncate text-center">
                                    {asset.name}
                                </div>
                                
                                {/* Audio Status Indicator on Tile */}
                                {asset.type !== 'AUDIO' && (
                                    <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${isActive ? (isMixMode ? 'bg-green-500' : 'bg-red-500') : 'hidden'}`}></div>
                                )}
                            </button>
                            
                            {/* Delete Button */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteAsset(asset.id); }}
                                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ADD SCENE MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-sm p-4">
                        <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                            <h3 className="font-bold text-white">Añadir Medio</h3>
                            <button onClick={() => setShowAddModal(false)}><X className="w-4 h-4 text-zinc-500"/></button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-zinc-400 block mb-1">Tipo de Recurso</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setNewType('AD')} className={`py-2 rounded border text-xs font-bold ${newType === 'AD' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>Video / Ad</button>
                                    <button onClick={() => setNewType('INTRO')} className={`py-2 rounded border text-xs font-bold ${newType === 'INTRO' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>Intro / Loop</button>
                                    <button onClick={() => setNewType('AUDIO')} className={`py-2 rounded border text-xs font-bold ${newType === 'AUDIO' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>Audio MP3</button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-zinc-400 block mb-1">Nombre</label>
                                <input 
                                    type="text" 
                                    value={newName} 
                                    onChange={(e) => setNewName(e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white"
                                    placeholder="Ej: Entrada Principal"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-400 block mb-1">Duración (Seg)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={newDuration} 
                                        onChange={(e) => setNewDuration(parseInt(e.target.value))} 
                                        className="w-20 bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white"
                                    />
                                    <button 
                                        onClick={() => setNewLoop(!newLoop)}
                                        className={`flex-1 py-2 rounded text-xs font-bold border ${newLoop ? 'bg-green-600/20 text-green-500 border-green-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                                    >
                                        {newLoop ? 'Bucle: SI' : 'Bucle: NO'}
                                    </button>
                                </div>
                            </div>

                             {/* Mock Upload */}
                             <div className="border-2 border-dashed border-zinc-700 rounded p-4 text-center cursor-pointer hover:border-zinc-500 bg-zinc-800/50">
                                 <Upload className="w-6 h-6 text-zinc-500 mx-auto mb-1" />
                                 <span className="text-[10px] text-zinc-400">Click para Subir Archivo (Simulado)</span>
                             </div>

                             <button 
                                onClick={handleAdd}
                                disabled={!newName}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded uppercase mt-2"
                            >
                                 Añadir a la Cola
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SceneController;