
import React, { useState, useEffect } from 'react';
import { CameraSource, DJIConnectionMode, HardwareDevice, DeviceType, StreamProtocol, StreamRole, ConnectionStatus, VideoFormat } from '../types';
import { discoverDevices, initiateQrHandshake, scanHardwarePorts, createHardwareSource } from '../services/ConnectivityCore';
import { createDjiSource, DjiModel } from '../services/DjiService';
import { QrCode, Wifi, Usb, Search, X, Loader2, Smartphone, Cable, Mic, Video, Globe, Camera, RefreshCcw, Plane, Send, Settings2 } from 'lucide-react';

interface AddSourceModalProps {
    onClose: () => void;
    onAdd: (source: CameraSource) => void;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({ onClose, onAdd }) => {
    const [activeTab, setActiveTab] = useState<'HARDWARE' | 'DISCOVER' | 'QR' | 'DJI' | 'GENERIC'>('HARDWARE');
    const [scanning, setScanning] = useState(false);
    const [qrValue, setQrValue] = useState('');
    const [hardwareList, setHardwareList] = useState<HardwareDevice[]>([]);
    
    // Generic Inputs
    const [genericUrl, setGenericUrl] = useState('rtsp://192.168.1.x:554/stream');
    const [genericName, setGenericName] = useState('Cámara IP 1');

    // DJI Config
    const [djiLowLatency, setDjiLowLatency] = useState(true);
    const [djiModel, setDjiModel] = useState<DjiModel>('MINI');

    // Scan hardware on mount or tab switch
    useEffect(() => {
        if (activeTab === 'HARDWARE') {
            handleScanHardware();
        }
    }, [activeTab]);

    const handleScanHardware = () => {
        setScanning(true);
        scanHardwarePorts().then(devices => {
            setHardwareList(devices);
            setScanning(false);
        });
    }

    const handleDiscover = async () => {
        setScanning(true);
        const devices = await discoverDevices();
        if (devices.length > 0) {
            onAdd(devices[0]);
            onClose();
        }
        setScanning(false);
    };

    const handleHardwareAdd = (device: HardwareDevice) => {
        const source = createHardwareSource(device);
        onAdd(source);
        onClose();
    };

    const handleQrConnect = async () => {
        setScanning(true);
        try {
            const cam = await initiateQrHandshake(qrValue);
            onAdd(cam);
            onClose();
        } catch (e) {
            alert("Emparejamiento Fallido");
        }
        setScanning(false);
    };

    const handleDjiConnect = (mode: DJIConnectionMode) => {
        const djiCam = createDjiSource(mode, djiLowLatency, djiModel);
        onAdd(djiCam);
        onClose();
    };

    const handleGenericAdd = () => {
        const isRTSP = genericUrl.startsWith('rtsp');
        const isHTTP = genericUrl.startsWith('http');
        
        const genericSource: CameraSource = {
            id: `gen-${Date.now()}`,
            name: genericName,
            type: DeviceType.GENERIC_IP,
            protocol: isRTSP ? StreamProtocol.RTSP : StreamProtocol.HTTP_HLS,
            role: StreamRole.BOTH,
            status: ConnectionStatus.CONNECTED,
            latencyMs: 300,
            batteryLevel: 100, // Mains power assumed
            signalStrength: 80,
            isLive: false,
            stats: { 
                bitrate: 4.5, 
                fps: 30, 
                jitter: 10, 
                packetLoss: 0.1,
                format: VideoFormat.H264,
                resolution: '1080p30'
            },
            thumbnailUrl: 'https://picsum.photos/seed/generic/800/450',
            ipAddress: genericUrl
        };
        onAdd(genericSource);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950">
                    <div>
                        <h2 className="text-white font-bold text-lg">Gestor de Entradas</h2>
                        <p className="text-xs text-zinc-500">Detectar & Configurar Fuentes</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>

                <div className="flex border-b border-zinc-800 bg-zinc-900 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('HARDWARE')}
                        className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeTab === 'HARDWARE' ? 'bg-zinc-800 text-green-400 border-b-2 border-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Hardware I/O
                    </button>
                    <button 
                        onClick={() => setActiveTab('GENERIC')}
                        className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeTab === 'GENERIC' ? 'bg-zinc-800 text-purple-400 border-b-2 border-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        IP / Genérico
                    </button>
                    <button 
                        onClick={() => setActiveTab('DISCOVER')}
                        className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeTab === 'DISCOVER' ? 'bg-zinc-800 text-blue-400 border-b-2 border-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Red Local
                    </button>
                    <button 
                        onClick={() => setActiveTab('QR')}
                        className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeTab === 'QR' ? 'bg-zinc-800 text-blue-400 border-b-2 border-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        QR Móvil
                    </button>
                    <button 
                        onClick={() => setActiveTab('DJI')}
                        className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeTab === 'DJI' ? 'bg-zinc-800 text-blue-400 border-b-2 border-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Drones DJI
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-zinc-950/50">
                    
                    {/* HARDWARE TAB */}
                    {activeTab === 'HARDWARE' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                    <Cable className="w-4 h-4" /> Puertos Físicos Detectados
                                </h3>
                                <div className="flex items-center gap-2">
                                    {scanning && <span className="text-xs text-green-500 animate-pulse">Escaneando puertos...</span>}
                                    <button 
                                        onClick={handleScanHardware}
                                        disabled={scanning}
                                        className="p-1.5 bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                        title="Refrescar Lista de Dispositivos"
                                    >
                                        <RefreshCcw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                {hardwareList.map((device, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-zinc-900 p-3 rounded border border-zinc-800 hover:border-zinc-600 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded ${device.kind === 'videoinput' ? 'bg-blue-500/10' : 'bg-pink-500/10'}`}>
                                                {device.kind === 'videoinput' ? <Video className="w-5 h-5 text-blue-500"/> : <Mic className="w-5 h-5 text-pink-500"/>}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-sm">{device.label || `Dispositivo ${device.kind} (Sin Nombre)`}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 rounded border border-zinc-700">{device.portLabel}</span>
                                                    <span className="text-[10px] text-zinc-500 uppercase">{device.kind === 'videoinput' ? 'Cámara / Capturadora' : 'Micrófono / Interfaz'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleHardwareAdd(device)}
                                            className="px-4 py-2 bg-zinc-800 hover:bg-green-600 hover:text-white text-zinc-300 text-xs font-bold uppercase rounded border border-zinc-700 transition-colors"
                                        >
                                            Activar
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {hardwareList.length === 0 && !scanning && (
                                <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-800 rounded">
                                    <p className="mb-2">No se encontraron dispositivos.</p>
                                    <button onClick={handleScanHardware} className="text-blue-500 hover:underline text-xs">Intentar de nuevo</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* GENERIC IP TAB */}
                    {activeTab === 'GENERIC' && (
                        <div className="space-y-4">
                            <div className="flex justify-center mb-2">
                                <div className="p-4 bg-purple-900/20 rounded-full">
                                    <Globe className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">Nombre del Dispositivo</label>
                                    <input 
                                        type="text" 
                                        value={genericName}
                                        onChange={(e) => setGenericName(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-white text-sm outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">URL del Stream (RTSP / SRT / HTTP)</label>
                                    <input 
                                        type="text" 
                                        value={genericUrl}
                                        onChange={(e) => setGenericUrl(e.target.value)}
                                        placeholder="rtsp://..."
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-white text-sm outline-none focus:border-purple-500 font-mono"
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-1">Soporta GoPro (Labs), Cámaras IP y señales SRT.</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenericAdd}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 mt-4"
                            >
                                <Camera className="w-4 h-4"/>
                                Añadir Fuente Genérica
                            </button>
                        </div>
                    )}

                    {activeTab === 'DISCOVER' && (
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center relative">
                                    <Wifi className="w-8 h-8 text-blue-500" />
                                    {scanning && <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping"></div>}
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">Escaneando red local (NDI/SRT)...</p>
                            <button 
                                onClick={handleDiscover}
                                disabled={scanning}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2"
                            >
                                {scanning ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                                {scanning ? 'Buscando...' : 'Escanear Red'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'QR' && (
                        <div className="space-y-4">
                             <div className="flex justify-center mb-4">
                                <QrCode className="w-16 h-16 text-zinc-600" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Pegar Token de Emparejamiento"
                                value={qrValue}
                                onChange={(e) => setQrValue(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-white text-sm focus:border-blue-500 outline-none font-mono"
                            />
                            <button 
                                onClick={handleQrConnect}
                                disabled={scanning || qrValue.length < 5}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {scanning ? <Loader2 className="w-4 h-4 animate-spin"/> : <Smartphone className="w-4 h-4"/>}
                                Conectar Smartphone
                            </button>
                        </div>
                    )}

                    {activeTab === 'DJI' && (
                        <div className="space-y-4">
                            {/* Configuration Panel */}
                            <div className="bg-zinc-800 p-3 rounded border border-zinc-700">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                                        <Settings2 className="w-3 h-3 text-blue-400"/> Configuración de Aeronave
                                    </h4>
                                </div>

                                {/* Model Selector */}
                                <div className="mb-3">
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase mb-1 block">Modelo</label>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setDjiModel('MINI')}
                                            className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border flex items-center justify-center gap-2 transition-all ${djiModel === 'MINI' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}
                                        >
                                            <Send className="w-3 h-3" /> Mini Series (Light)
                                        </button>
                                        <button 
                                            onClick={() => setDjiModel('MAVIC')}
                                            className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border flex items-center justify-center gap-2 transition-all ${djiModel === 'MAVIC' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}
                                        >
                                            <Plane className="w-3 h-3" /> Mavic Series (Pro)
                                        </button>
                                    </div>
                                </div>

                                {/* Latency Selector */}
                                <div>
                                    <label className="text-[9px] font-bold text-zinc-500 uppercase mb-1 block">Modo de Transmisión</label>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setDjiLowLatency(true)}
                                            className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border transition-all ${djiLowLatency ? 'bg-green-600 border-green-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}
                                        >
                                            Baja Latencia (Deportes)
                                        </button>
                                        <button 
                                            onClick={() => setDjiLowLatency(false)}
                                            className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border transition-all ${!djiLowLatency ? 'bg-orange-600 border-orange-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}
                                        >
                                            Alta Calidad (Cine)
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 text-[10px] text-zinc-400 bg-black/20 p-2 rounded">
                                    {djiModel === 'MAVIC' 
                                        ? "Mavic 3 Cine: Soporta bitrate alto (50Mbps+). O3+ activado para estabilidad." 
                                        : "Mini 3 Pro: Optimizado para agilidad. Bitrate balanceado para evitar lag."}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={() => handleDjiConnect(DJIConnectionMode.RC_USB)}
                                    className="flex items-center justify-between bg-zinc-800 p-4 rounded border border-zinc-700 hover:border-blue-500 group transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded group-hover:bg-green-500/20">
                                            <Usb className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-white font-bold text-sm">USB-C Directo (RC-N1 / RC Pro)</div>
                                            <div className="text-zinc-500 text-xs">Cableado • Señal sin compresión extra</div>
                                        </div>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => handleDjiConnect(DJIConnectionMode.FLY_RTMP)}
                                    className="flex items-center justify-between bg-zinc-800 p-4 rounded border border-zinc-700 hover:border-blue-500 group transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/10 rounded group-hover:bg-orange-500/20">
                                            <Wifi className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-white font-bold text-sm">RTMP Stream (DJI Fly App)</div>
                                            <div className="text-zinc-500 text-xs">Inalámbrico • Requiere retransmisión local</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddSourceModal;
