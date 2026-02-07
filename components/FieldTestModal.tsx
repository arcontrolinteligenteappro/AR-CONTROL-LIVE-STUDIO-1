import React, { useState, useEffect } from 'react';
import { CameraSource, TestPhase, VideoEngineStats, ConnectionStatus } from '../types';
import { X, Wifi, Thermometer, Activity, ShieldAlert, Radio, AlertTriangle, Zap, ServerCrash } from 'lucide-react';

interface FieldTestModalProps {
    phase: TestPhase;
    setPhase: (p: TestPhase) => void;
    cameras: CameraSource[];
    engineStats: VideoEngineStats;
    onClose: () => void;
    onSimulateFail: (type: 'DISCONNECT' | 'LAG') => void;
    toggleStress: (active: boolean) => void;
}

const FieldTestModal: React.FC<FieldTestModalProps> = ({ 
    phase, setPhase, cameras, engineStats, onClose, onSimulateFail, toggleStress 
}) => {

    // PHASE 1: Network Check Logic
    const avgLatency = cameras.reduce((acc, c) => acc + c.latencyMs, 0) / (cameras.length || 1);
    const avgLoss = cameras.reduce((acc, c) => acc + c.stats.packetLoss, 0) / (cameras.length || 1);
    
    // PHASE 2: Load Test Logic
    const [stressTime, setStressTime] = useState(0);
    useEffect(() => {
        let interval: any;
        if (phase === TestPhase.PHASE_2_LOAD) {
            toggleStress(true);
            interval = setInterval(() => setStressTime(p => p + 1), 1000);
        } else {
            toggleStress(false);
            setStressTime(0);
        }
        return () => clearInterval(interval);
    }, [phase]);

    const renderPhase1 = () => (
        <div className="space-y-4">
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <h3 className="text-zinc-300 font-bold mb-3 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-400" /> Source Telemetry
                </h3>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {cameras.map(cam => (
                        <div key={cam.id} className="flex items-center justify-between bg-zinc-900 p-2 rounded text-xs">
                            <span className="font-bold text-zinc-300 w-24 truncate">{cam.name}</span>
                            <span className={`font-mono ${cam.latencyMs > 200 ? 'text-red-500' : 'text-green-500'}`}>
                                {cam.latencyMs.toFixed(0)}ms
                            </span>
                            <span className={`font-mono ${cam.stats.packetLoss > 1 ? 'text-red-500' : 'text-zinc-400'}`}>
                                Loss: {cam.stats.packetLoss.toFixed(1)}%
                            </span>
                            <span className="text-zinc-500">{cam.protocol}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-zinc-400 border-t border-zinc-700 pt-2">
                    <span>Avg Latency: <b className="text-white">{avgLatency.toFixed(0)}ms</b></span>
                    <span>Avg Loss: <b className="text-white">{avgLoss.toFixed(1)}%</b></span>
                </div>
            </div>
            <button 
                onClick={() => setPhase(TestPhase.PHASE_2_LOAD)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded"
            >
                Network Pass → Go to Load Test
            </button>
        </div>
    );

    const renderPhase2 = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <div>
                    <h3 className="text-zinc-300 font-bold mb-1">Synthetic Load Test</h3>
                    <p className="text-xs text-zinc-500">Video Engine @ 120% Stress</p>
                </div>
                <div className="text-2xl font-mono font-bold text-white">{stressTime}s</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border flex flex-col items-center justify-center ${engineStats.temperatureC > 42 ? 'bg-red-900/20 border-red-500' : 'bg-zinc-800 border-zinc-700'}`}>
                    <Thermometer className={`w-8 h-8 mb-2 ${engineStats.temperatureC > 42 ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
                    <span className="text-2xl font-bold text-white">{engineStats.temperatureC.toFixed(1)}°C</span>
                    <span className="text-xs text-zinc-500 uppercase">Core Temp</span>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex flex-col items-center justify-center">
                    <Activity className="w-8 h-8 text-purple-500 mb-2" />
                    <span className="text-2xl font-bold text-white">{engineStats.ramUsage} MB</span>
                    <span className="text-xs text-zinc-500 uppercase">RAM Usage</span>
                </div>
            </div>

            {engineStats.survivalMode && (
                 <div className="bg-red-900/30 border border-red-500 p-3 rounded flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    <div>
                        <div className="text-red-500 font-bold text-sm">SURVIVAL MODE ACTIVE</div>
                        <div className="text-red-400 text-xs">System > 42°C. Resolution lowered.</div>
                    </div>
                 </div>
            )}

            <button 
                onClick={() => setPhase(TestPhase.PHASE_3_PRIVATE)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded"
            >
                Stable? → Go to Stream Test
            </button>
        </div>
    );

    const renderPhase3 = () => (
        <div className="space-y-4">
            <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 text-center">
                <Radio className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">Private Stream Check</h3>
                <p className="text-sm text-zinc-400 mb-6">
                    Start a PRIVATE stream to YouTube/TikTok. <br/>
                    Check sync on a separate device.
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold uppercase">
                    Start Test Stream
                </button>
            </div>
            <button 
                onClick={() => setPhase(TestPhase.PHASE_4_ERROR)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded"
            >
                Sync Verified → Go to Chaos Monkey
            </button>
        </div>
    );

    const renderPhase4 = () => (
        <div className="space-y-4">
            <div className="bg-yellow-900/10 border border-yellow-700/50 p-4 rounded-lg">
                <h3 className="text-yellow-500 font-bold flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" /> Chaos Monkey (Error Sim)
                </h3>
                <p className="text-xs text-yellow-200/70">
                    Intentionally break things to verify app recovery. App should NOT crash.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <button 
                    onClick={() => onSimulateFail('LAG')}
                    className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded border border-zinc-700 text-left"
                >
                    <div className="bg-orange-500/20 p-2 rounded"><Zap className="w-5 h-5 text-orange-500"/></div>
                    <div>
                        <div className="text-white font-bold text-sm">Simulate Network Lag Spike</div>
                        <div className="text-zinc-500 text-xs">Inject 500ms latency + jitter</div>
                    </div>
                </button>

                <button 
                     onClick={() => onSimulateFail('DISCONNECT')}
                    className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded border border-zinc-700 text-left"
                >
                    <div className="bg-red-500/20 p-2 rounded"><ServerCrash className="w-5 h-5 text-red-500"/></div>
                    <div>
                        <div className="text-white font-bold text-sm">Kill Random Camera</div>
                        <div className="text-zinc-500 text-xs">Force "SIGNAL LOST" state</div>
                    </div>
                </button>
            </div>

             <button 
                onClick={() => { setPhase(TestPhase.PHASE_5_LIVE); onClose(); }}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold uppercase rounded mt-4"
            >
                System Resilient → GO LIVE
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                    <div>
                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-orange-500" /> Stadium Field Test
                        </h2>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">
                            Phase {phase === TestPhase.PHASE_1_NETWORK ? '1/4' : phase === TestPhase.PHASE_2_LOAD ? '2/4' : phase === TestPhase.PHASE_3_PRIVATE ? '3/4' : '4/4'}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-zinc-900 flex">
                    <div className={`h-full ${phase === TestPhase.PHASE_1_NETWORK ? 'bg-blue-500 w-1/4' : phase === TestPhase.PHASE_2_LOAD ? 'bg-blue-500 w-2/4' : phase === TestPhase.PHASE_3_PRIVATE ? 'bg-blue-500 w-3/4' : 'bg-green-500 w-full'} transition-all duration-500`}></div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {phase === TestPhase.PHASE_1_NETWORK && renderPhase1()}
                    {phase === TestPhase.PHASE_2_LOAD && renderPhase2()}
                    {phase === TestPhase.PHASE_3_PRIVATE && renderPhase3()}
                    {phase === TestPhase.PHASE_4_ERROR && renderPhase4()}
                </div>

                {/* Footer Info */}
                <div className="p-3 bg-zinc-900 border-t border-zinc-800 text-[10px] text-zinc-500 text-center font-mono">
                    ARCONTROL DIAGNOSTICS SUITE V1.0
                </div>
            </div>
        </div>
    );
};

export default FieldTestModal;