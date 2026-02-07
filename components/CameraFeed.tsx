import React, { useEffect, useRef, useState } from 'react';
import { CameraSource, ConnectionStatus, DeviceType, StreamRole, StreamProtocol } from '../types';
import { Wifi, WifiOff, Battery, BatteryMedium, BatteryLow, Signal, AlertTriangle, Video, Smartphone, Camera, Mic, Disc, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, Move, Globe, Crosshair, Keyboard, Scan, Target, ZoomIn, ZoomOut, Save, Rewind } from 'lucide-react';

interface CameraFeedProps {
  camera: CameraSource;
  onSelect: (id: string) => void;
  isProgram: boolean;
  onGimbalChange?: (pitch: number, yaw: number) => void;
  onUpdateCamera?: (id: string, updates: Partial<CameraSource>) => void;
  onToggleFacingMode?: () => void;
  onTriggerReplay?: (duration: number) => void; // Added Replay Handler
  overlayNode?: React.ReactNode; 
  showOperatorOverlays?: boolean; 
}

const CameraFeed: React.FC<CameraFeedProps> = ({ camera, onSelect, isProgram, onGimbalChange, onUpdateCamera, onToggleFacingMode, onTriggerReplay, overlayNode, showOperatorOverlays }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [precisionMode, setPrecisionMode] = useState(false);
  const [isEditingPresets, setIsEditingPresets] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // Local state for immediate feedback, synced with camera.ptz if available
  const [ptzState, setPtzState] = useState({ pan: 0, tilt: 0, zoom: 0 });

  // Sync internal state if camera changes externally
  useEffect(() => {
      if (camera.ptz) {
          setPtzState({ pan: camera.ptz.pan, tilt: camera.ptz.tilt, zoom: camera.ptz.zoom });
      }
  }, [camera.id]); // Only reset on camera change

  // REAL VIDEO MOUNTING LOGIC
  useEffect(() => {
      let currentStream: MediaStream | null = null;
      if (camera.protocol === StreamProtocol.HARDWARE && camera.deviceId && videoRef.current) {
          navigator.mediaDevices.getUserMedia({
              video: { deviceId: camera.deviceId } 
          }).then(stream => {
              currentStream = stream;
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                  videoRef.current.play().catch(e => console.error("Play error", e));
              }
          }).catch(err => {
              console.error("Error accessing camera:", err);
              navigator.mediaDevices.getUserMedia({ video: true })
                .then(fallbackStream => {
                    currentStream = fallbackStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = fallbackStream;
                        videoRef.current.play().catch(e => console.error("Fallback play error", e));
                    }
                })
                .catch(e => console.warn("Fallback failed", e));
          });
      }
      
      return () => {
          if (currentStream) {
              currentStream.getTracks().forEach(track => track.stop());
          }
      };
  }, [camera.deviceId, camera.protocol]);

  const getIcon = () => {
    switch (camera.type) {
      case DeviceType.DRONE: return <Disc className="w-4 h-4 animate-spin-slow" />;
      case DeviceType.SMARTPHONE: return <Smartphone className="w-4 h-4" />;
      case DeviceType.GOPRO: return <Camera className="w-4 h-4" />;
      case DeviceType.GENERIC_IP: return <Globe className="w-4 h-4" />;
      case DeviceType.PTZ_CAMERA: return <Scan className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const getSignalIcon = (strength: number) => {
      if (strength > 75) return <Wifi className="w-3 h-3 text-green-500" />;
      if (strength > 40) return <Wifi className="w-3 h-3 text-yellow-500" />;
      return <WifiOff className="w-3 h-3 text-red-500" />;
  };

  const handleGimbalMove = (dPitch: number, dYaw: number) => {
      if (!camera.gimbal && !camera.ptz) return;
      const step = precisionMode ? 1 : 10;
      
      if (camera.gimbal && onGimbalChange) {
          const newPitch = Math.max(-90, Math.min(20, camera.gimbal.pitch + (dPitch * step)));
          const newYaw = Math.max(-180, Math.min(180, camera.gimbal.yaw + (dYaw * step)));
          onGimbalChange(newPitch, newYaw);
      }

      if (camera.type === DeviceType.PTZ_CAMERA) {
          const newPan = Math.max(-180, Math.min(180, ptzState.pan + (dYaw * step)));
          const newTilt = Math.max(-90, Math.min(90, ptzState.tilt + (dPitch * step)));
          setPtzState(prev => ({ ...prev, pan: newPan, tilt: newTilt }));
      }
  };

  const handleZoom = (delta: number) => {
      if (camera.type !== DeviceType.PTZ_CAMERA) return;
      setPtzState(prev => ({ ...prev, zoom: Math.max(0, Math.min(100, prev.zoom + delta)) }));
  }

  const handlePresetClick = (presetId: number) => {
      if (isEditingPresets) {
          if (camera.ptz && onUpdateCamera) {
              const newPresets = camera.ptz.presets.map(p => 
                  p.id === presetId ? { ...p, pan: ptzState.pan, tilt: ptzState.tilt, zoom: ptzState.zoom } : p
              );
              onUpdateCamera(camera.id, { ptz: { ...camera.ptz, presets: newPresets } });
              setIsEditingPresets(false);
          }
      } else {
          const preset = camera.ptz?.presets.find(p => p.id === presetId);
          if (preset) {
              setPtzState({ pan: preset.pan, tilt: preset.tilt, zoom: preset.zoom });
          }
      }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isProgram || (camera.type !== DeviceType.DRONE && camera.type !== DeviceType.PTZ_CAMERA)) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
          e.preventDefault();
          setActiveKey(e.key);
          switch(e.key) {
              case 'ArrowUp': handleGimbalMove(1, 0); break;
              case 'ArrowDown': handleGimbalMove(-1, 0); break;
              case 'ArrowLeft': handleGimbalMove(0, -1); break;
              case 'ArrowRight': handleGimbalMove(0, 1); break;
              case 'Enter': setPrecisionMode(p => !p); break;
          }
      }
  };

  const handleKeyUp = () => { setActiveKey(null); };

  const isSignalLost = camera.status === ConnectionStatus.LOST || camera.status === ConnectionStatus.RECONNECTING;

  if (isProgram) {
      return (
        <div 
            className="relative w-full h-full bg-black overflow-hidden group outline-none focus:ring-2 focus:ring-blue-500/50"
            tabIndex={camera.type === DeviceType.DRONE || camera.type === DeviceType.PTZ_CAMERA ? 0 : -1} 
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        >
            {isSignalLost ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
                    <AlertTriangle className="w-16 h-16 text-red-600 mb-4 animate-pulse" />
                    <span className="text-red-500 font-mono text-xl tracking-widest uppercase font-bold">
                        {camera.status === ConnectionStatus.RECONNECTING ? 'RECONECTANDO...' : 'SEÑAL PERDIDA'}
                    </span>
                </div>
            ) : (
                camera.protocol === StreamProtocol.HARDWARE ? (
                    <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                ) : (
                    <img 
                        src={camera.thumbnailUrl} 
                        alt={camera.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${camera.facingMode === 'USER' ? 'scale-x-[-1]' : ''}`} 
                        style={camera.type === DeviceType.PTZ_CAMERA ? { transform: `scale(${1 + (ptzState.zoom / 50)}) translate(${-ptzState.pan}px, ${ptzState.tilt}px)`} : {}}
                    />
                )
            )}

            {overlayNode && !isSignalLost && <div className="absolute inset-0 z-10 pointer-events-none">{overlayNode}</div>}

            {!isSignalLost && (
                 <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-1 pointer-events-none">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-white font-bold text-xs backdrop-blur-md border shadow-sm transition-all ${showOperatorOverlays ? 'bg-black/70 border-white/10' : 'bg-black/40 border-white/5 opacity-80 hover:opacity-100'}`}>
                          <span className="text-[9px] uppercase text-zinc-300 tracking-wider">
                              {camera.type === DeviceType.DRONE ? 'RC Link' : (camera.type === DeviceType.PTZ_CAMERA ? 'PTZ Link' : 'Net Link')}
                          </span>
                          <div className="h-3 w-px bg-white/20"></div>
                          <div className="flex items-center gap-1">
                              {getSignalIcon(camera.signalStrength)}
                              <span>{camera.signalStrength}%</span>
                          </div>
                      </div>
                 </div>
            )}

            {/* --- PTZ / GIMBAL CONTROLLER OVERLAY --- */}
            {(camera.type === DeviceType.DRONE || camera.type === DeviceType.PTZ_CAMERA) && !isSignalLost && (
                <div className="absolute bottom-8 right-8 z-40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 outline-none" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-zinc-700/50 shadow-2xl flex flex-col items-center gap-2 w-48">
                        <div className="flex items-center justify-between w-full mb-1">
                             <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <Move className="w-3 h-3 text-blue-500" /> {camera.type === DeviceType.DRONE ? 'Gimbal' : 'PTZ Head'}
                            </div>
                            <button 
                                onClick={() => setPrecisionMode(!precisionMode)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[8px] font-bold uppercase transition-colors ${precisionMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-600 text-zinc-400'}`}
                            >
                                <Crosshair className="w-3 h-3" />
                                {precisionMode ? 'Fino' : 'Rápido'}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1 mb-2">
                            <div className="flex items-center justify-center text-zinc-700"><Keyboard className="w-3 h-3 opacity-20"/></div>
                            <button className={`w-10 h-10 bg-zinc-800 hover:bg-blue-600 active:bg-blue-700 text-white rounded-t-lg flex items-center justify-center transition-colors shadow-sm ${activeKey === 'ArrowUp' ? 'bg-blue-600 ring-2 ring-blue-400 z-10' : ''}`} onClick={() => handleGimbalMove(1, 0)}><ArrowUp className="w-5 h-5"/></button>
                            <div />
                            <button className={`w-10 h-10 bg-zinc-800 hover:bg-blue-600 active:bg-blue-700 text-white rounded-l-lg flex items-center justify-center transition-colors shadow-sm ${activeKey === 'ArrowLeft' ? 'bg-blue-600 ring-2 ring-blue-400 z-10' : ''}`} onClick={() => handleGimbalMove(0, -1)}><ArrowLeft className="w-5 h-5"/></button>
                            <div className="w-10 h-10 bg-zinc-950 flex flex-col items-center justify-center rounded border border-zinc-800 shadow-inner cursor-default">
                                <span className="text-[8px] font-mono text-zinc-500">P:{camera.type === DeviceType.PTZ_CAMERA ? ptzState.tilt.toFixed(0) : camera.gimbal?.pitch}°</span>
                                <span className="text-[8px] font-mono text-zinc-500">Y:{camera.type === DeviceType.PTZ_CAMERA ? ptzState.pan.toFixed(0) : camera.gimbal?.yaw}°</span>
                            </div>
                            <button className={`w-10 h-10 bg-zinc-800 hover:bg-blue-600 active:bg-blue-700 text-white rounded-r-lg flex items-center justify-center transition-colors shadow-sm ${activeKey === 'ArrowRight' ? 'bg-blue-600 ring-2 ring-blue-400 z-10' : ''}`} onClick={() => handleGimbalMove(0, 1)}><ArrowRight className="w-5 h-5"/></button>
                            <div />
                            <button className={`w-10 h-10 bg-zinc-800 hover:bg-blue-600 active:bg-blue-700 text-white rounded-b-lg flex items-center justify-center transition-colors shadow-sm ${activeKey === 'ArrowDown' ? 'bg-blue-600 ring-2 ring-blue-400 z-10' : ''}`} onClick={() => handleGimbalMove(-1, 0)}><ArrowDown className="w-5 h-5"/></button>
                            <div />
                        </div>

                        {camera.type === DeviceType.PTZ_CAMERA && (
                            <div className="w-full space-y-2 border-t border-zinc-700 pt-2">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleZoom(-5)} className="p-1.5 bg-zinc-800 rounded hover:bg-zinc-700"><ZoomOut className="w-3 h-3 text-zinc-400"/></button>
                                    <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${ptzState.zoom}%` }}></div>
                                    </div>
                                    <button onClick={() => handleZoom(5)} className="p-1.5 bg-zinc-800 rounded hover:bg-zinc-700"><ZoomIn className="w-3 h-3 text-zinc-400"/></button>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[8px] font-bold text-zinc-500 uppercase">Memoria</span>
                                    <button onClick={() => setIsEditingPresets(!isEditingPresets)} className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border transition-colors ${isEditingPresets ? 'bg-red-900/50 text-red-400 border-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-400 border-zinc-600'}`}>{isEditingPresets ? '● Grabar' : 'Llamar'}</button>
                                </div>
                                <div className="grid grid-cols-4 gap-1">
                                    {[1,2,3,4].map(pid => (
                                        <button key={pid} onClick={() => handlePresetClick(pid)} className={`text-[9px] font-bold py-1.5 rounded border transition-all ${isEditingPresets ? 'bg-red-600/20 text-red-400 border-red-500/50 hover:bg-red-600 hover:text-white' : 'bg-zinc-800 hover:bg-blue-900 text-zinc-400 hover:text-blue-400 border-zinc-700'}`}>P{pid}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="w-full border-t border-zinc-700 pt-1 mt-1 space-y-1">
                            <button 
                                onClick={() => camera.type === DeviceType.PTZ_CAMERA ? setPtzState({ pan: 0, tilt: 0, zoom: 0 }) : onGimbalChange?.(0, 0)}
                                className="w-full bg-zinc-800 text-[8px] py-1.5 rounded hover:bg-zinc-700 text-zinc-300 font-bold border border-zinc-700 uppercase"
                            >
                                Centrar
                            </button>
                            {/* NEW: QUICK REPLAY BUTTON FOR ACTIVE CAMERA */}
                            {onTriggerReplay && (
                                <button 
                                    onClick={() => onTriggerReplay(8)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-[9px] py-2 rounded text-white font-black border border-red-500 uppercase flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                                >
                                    <Rewind className="w-3.5 h-3.5" /> Replay 8s
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {camera.type === DeviceType.SMARTPHONE && !isSignalLost && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFacingMode?.(); }}
                    className="absolute top-4 right-4 z-40 bg-zinc-900/50 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Rotar Cámara"
                 >
                     <RefreshCw className="w-5 h-5" />
                 </button>
            )}
            
            {showOperatorOverlays && !isSignalLost && (
                <div className="absolute top-4 left-4 flex flex-col gap-1 z-20 pointer-events-none">
                    <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded font-black text-xs shadow-lg animate-pulse">PROGRAM OUT</div>
                    <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-white font-bold text-lg shadow-sm flex items-center gap-2">
                        {getIcon()}
                        {camera.name}
                        {camera.facingMode && <span className="text-[10px] text-zinc-400 ml-2 uppercase border border-zinc-500 px-1 rounded">{camera.facingMode === 'USER' ? 'FRONT' : 'BACK'}</span>}
                    </div>
                    <div className="flex gap-1 mt-1">
                        <span className="text-[9px] bg-black/50 text-blue-400 px-1 rounded font-mono border border-blue-900/30">{camera.protocol}</span>
                        <span className="text-[9px] bg-black/50 text-zinc-400 px-1 rounded font-mono">{camera.stats.resolution || '1080p'}</span>
                    </div>
                </div>
            )}
        </div>
      );
  }

  return null;
};

export default CameraFeed;