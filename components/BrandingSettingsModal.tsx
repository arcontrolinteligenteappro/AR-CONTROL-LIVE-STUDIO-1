import React from 'react';
import { WatermarkSettings, StreamingState } from '../types';
import { X, Type, Image as ImageIcon, Layout, Smartphone, Monitor, SplitSquareHorizontal } from 'lucide-react';

interface BrandingSettingsModalProps {
    watermark: WatermarkSettings;
    streamingState: StreamingState;
    onUpdateWatermark: (w: Partial<WatermarkSettings>) => void;
    onUpdateStream: (s: Partial<StreamingState>) => void;
    onClose: () => void;
}

const BrandingSettingsModal: React.FC<BrandingSettingsModalProps> = ({ watermark, streamingState, onUpdateWatermark, onUpdateStream, onClose }) => {
    
    // Mock logo upload
    const handleLogoUpload = () => {
        // In real app, file picker. Here, we rotate mock logos.
        const logos = [
            'https://picsum.photos/seed/logo1/100/100',
            'https://picsum.photos/seed/logo2/100/100',
            'https://picsum.photos/seed/logo3/100/100'
        ];
        const random = logos[Math.floor(Math.random() * logos.length)];
        onUpdateWatermark({ logoUrl: random });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950">
                    <div>
                        <h2 className="text-white font-bold text-lg">Marca y Configuración</h2>
                        <p className="text-xs text-zinc-500">Personalización de Salida</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>

                <div className="p-6 space-y-6">
                    
                    {/* ORIENTATION SECTION */}
                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase mb-2 flex items-center gap-2">
                            <Layout className="w-4 h-4 text-blue-500" /> Orientación de Salida
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => onUpdateStream({ outputFormat: 'LANDSCAPE_16_9' })}
                                className={`p-3 rounded border flex flex-col items-center gap-2 ${streamingState.outputFormat === 'LANDSCAPE_16_9' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                            >
                                <Monitor className="w-6 h-6" />
                                <span className="text-[9px] font-bold uppercase">Horizontal</span>
                            </button>
                            <button 
                                onClick={() => onUpdateStream({ outputFormat: 'PORTRAIT_9_16' })}
                                className={`p-3 rounded border flex flex-col items-center gap-2 ${streamingState.outputFormat === 'PORTRAIT_9_16' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                            >
                                <Smartphone className="w-6 h-6" />
                                <span className="text-[9px] font-bold uppercase">Vertical</span>
                            </button>
                            <button 
                                onClick={() => onUpdateStream({ outputFormat: 'SIMULCAST' })}
                                className={`p-3 rounded border flex flex-col items-center gap-2 ${streamingState.outputFormat === 'SIMULCAST' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                            >
                                <SplitSquareHorizontal className="w-6 h-6" />
                                <span className="text-[9px] font-bold uppercase">Simulcast</span>
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800 w-full"></div>

                    {/* WATERMARK SECTION */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-purple-500" /> Marca de Agua (Watermark)
                            </h3>
                            <button 
                                onClick={() => onUpdateWatermark({ enabled: !watermark.enabled })}
                                className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${watermark.enabled ? 'bg-green-500 justify-end' : 'bg-zinc-700 justify-start'}`}
                            >
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                            </button>
                        </div>

                        {watermark.enabled && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                {/* TEXT INPUT */}
                                <div>
                                    <label className="text-[10px] text-zinc-500 mb-1 block">Texto de Marca</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Type className="absolute left-2 top-2 w-4 h-4 text-zinc-500" />
                                            <input 
                                                type="text" 
                                                value={watermark.text}
                                                onChange={(e) => onUpdateWatermark({ text: e.target.value })}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded py-1.5 pl-8 pr-2 text-xs text-white"
                                                placeholder="Ej: EN VIVO"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* LOGO PICKER */}
                                <div>
                                    <label className="text-[10px] text-zinc-500 mb-1 block">Logo del Canal</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-zinc-950 rounded border border-zinc-700 flex items-center justify-center overflow-hidden">
                                            {watermark.logoUrl ? (
                                                <img src={watermark.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                        <button 
                                            onClick={handleLogoUpload}
                                            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] font-bold uppercase border border-zinc-700"
                                        >
                                            Seleccionar Archivo...
                                        </button>
                                    </div>
                                </div>

                                {/* POSITION GRID */}
                                <div>
                                    <label className="text-[10px] text-zinc-500 mb-1 block">Posición en Pantalla</label>
                                    <div className="grid grid-cols-2 gap-1 w-24">
                                        <button onClick={() => onUpdateWatermark({ position: 'TOP_LEFT' })} className={`h-8 rounded border ${watermark.position === 'TOP_LEFT' ? 'bg-purple-600 border-purple-400' : 'bg-zinc-800 border-zinc-700'}`}></button>
                                        <button onClick={() => onUpdateWatermark({ position: 'TOP_RIGHT' })} className={`h-8 rounded border ${watermark.position === 'TOP_RIGHT' ? 'bg-purple-600 border-purple-400' : 'bg-zinc-800 border-zinc-700'}`}></button>
                                        <button onClick={() => onUpdateWatermark({ position: 'BOTTOM_LEFT' })} className={`h-8 rounded border ${watermark.position === 'BOTTOM_LEFT' ? 'bg-purple-600 border-purple-400' : 'bg-zinc-800 border-zinc-700'}`}></button>
                                        <button onClick={() => onUpdateWatermark({ position: 'BOTTOM_RIGHT' })} className={`h-8 rounded border ${watermark.position === 'BOTTOM_RIGHT' ? 'bg-purple-600 border-purple-400' : 'bg-zinc-800 border-zinc-700'}`}></button>
                                    </div>
                                </div>

                                {/* OPACITY */}
                                <div>
                                    <label className="text-[10px] text-zinc-500 mb-1 block">Opacidad: {(watermark.opacity * 100).toFixed(0)}%</label>
                                    <input 
                                        type="range" 
                                        min="0" max="1" step="0.1" 
                                        value={watermark.opacity}
                                        onChange={(e) => onUpdateWatermark({ opacity: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-zinc-950 p-3 border-t border-zinc-800 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandingSettingsModal;