
import React, { useState } from 'react';
import { CameraSource, AISuggestion } from '../types';
import { Bot, Mic, Radio, Activity } from 'lucide-react';

interface GeminiCopilotProps {
  activeCamera: CameraSource | undefined;
  suggestion: AISuggestion | null;
  onExecuteSuggestion: (suggestion: AISuggestion) => void;
}

const GeminiCopilot: React.FC<GeminiCopilotProps> = ({ activeCamera, suggestion, onExecuteSuggestion }) => {
  const [isLive, setIsLive] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  // Lógica de escucha simplificada para la demo técnica
  const simulateVoiceControl = (transcript: string) => {
      if (transcript.includes("cámara 1")) onExecuteSuggestion({ type: 'CUT', reason: 'Voz', targetId: 'cam-1' });
      if (transcript.includes("repetir")) onExecuteSuggestion({ type: 'REPLAY', reason: 'Voz' });
      if (transcript.includes("vender")) onExecuteSuggestion({ type: 'SALE_CONFIRM', reason: 'Locutor anunció producto', sku: 'JSY-2024' });
      setLastAction(transcript);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-600/20 rounded">
                <Bot className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Director IA</span>
        </div>
        <button 
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${isLive ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-zinc-800 text-zinc-400'}`}
        >
            <Radio className={`w-3 h-3 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'ESCUCHANDO' : 'ACTIVAR VOZ'}
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {isLive ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                    <Mic className="w-12 h-12 text-blue-500 relative z-10" />
                </div>
                <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-tighter">Control por Voz Activo</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Prueba: "Corta a cámara 1" o "Vender Jersey"</p>
                </div>
                {lastAction && (
                    <div className="bg-black/40 p-2 rounded border border-zinc-800 w-full animate-in fade-in">
                        <span className="text-[9px] text-zinc-500 block mb-1">Último Comando:</span>
                        <span className="text-xs font-mono text-green-400 italic">"{lastAction}"</span>
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-3">
                <div className="bg-zinc-800/50 p-3 rounded border border-zinc-700">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Análisis Táctico (Frame actual)</h4>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                        "La defensa del equipo local está muy adelantada. Sugiero usar la Cámara Cenital (Drone) para capturar el contraataque."
                    </p>
                </div>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded transition-all">
                    Generar Nuevo Análisis
                </button>
            </div>
        )}
      </div>

      <div className="p-3 bg-zinc-950 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
            <Activity className="w-3 h-3 text-green-500" />
            <span>GEMINI LIVE API CONNECTED • LATENCY: 120ms</span>
        </div>
      </div>
    </div>
  );
};

export default GeminiCopilot;
