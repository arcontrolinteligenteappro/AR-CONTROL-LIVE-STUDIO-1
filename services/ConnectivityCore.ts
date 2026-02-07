
import { CameraSource, ConnectionStatus, DeviceType, HardwareDevice, StreamProtocol, StreamRole, VideoFormat } from '../types';

// Detects the native format of the source and "normalizes" it for the Video Engine
const detectAndNormalizeFormat = (type: DeviceType, protocol: StreamProtocol): VideoFormat => {
    if (protocol === StreamProtocol.NDI) return VideoFormat.YUV_420; // NDI decodes to Planar YUV
    if (protocol === StreamProtocol.SRT || protocol === StreamProtocol.RTMP) return VideoFormat.H264; // Compressed
    if (protocol === StreamProtocol.USB) return VideoFormat.NV12; // UVC usually MJPEG or NV12
    return VideoFormat.YUV_420;
};

// Simulation of mDNS / NSD (Network Service Discovery)
export const discoverDevices = (): Promise<CameraSource[]> => {
  return new Promise((resolve) => {
    // Simulating network scan delay
    setTimeout(() => {
      resolve([
        {
            id: `net-cam-${Date.now()}`,
            name: 'NDI PTZ Camera 1',
            type: DeviceType.HDMI,
            protocol: StreamProtocol.NDI,
            role: StreamRole.BOTH,
            status: ConnectionStatus.CONNECTED, 
            latencyMs: 35,
            batteryLevel: 100, // Wired
            signalStrength: 95, 
            isLive: false,
            stats: { 
                bitrate: 15.0, 
                fps: 60, 
                jitter: 2, 
                packetLoss: 0,
                format: VideoFormat.YUV_420,
                resolution: '1080p60'
            },
            thumbnailUrl: 'https://picsum.photos/seed/ndi/800/450',
            ipAddress: '192.168.1.50'
        }
      ]);
    }, 1500);
  });
};

// --- REAL HARDWARE SCANNER ---
export const scanHardwarePorts = async (): Promise<HardwareDevice[]> => {
    try {
        if (!navigator.mediaDevices?.getUserMedia) {
             throw new Error("Media API unavailable");
        }

        // Request permission implicitly if not granted
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        return devices.map(d => ({
            deviceId: d.deviceId,
            label: d.label || `Device ${d.kind} (${d.deviceId.slice(0, 4)})`,
            kind: d.kind as 'audioinput' | 'videoinput',
            groupId: d.groupId,
            portLabel: d.kind === 'videoinput' ? 'USB Video' : 'USB Audio'
        })).filter(d => d.kind === 'audioinput' || d.kind === 'videoinput');

    } catch (e) {
        console.error("Hardware Scan Failed:", e);
        // Fallback to mocks if permission denied or no devices
        return [
            { deviceId: 'mock-1', label: 'Simulated Webcam', kind: 'videoinput', groupId: 'g1', portLabel: 'Virtual' }
        ];
    }
};

export const createHardwareSource = (device: HardwareDevice): CameraSource => {
    const isAudioOnly = device.kind === 'audioinput';
    const isCaptureCard = device.label.toLowerCase().includes('cam link') || device.label.toLowerCase().includes('capture');

    return {
        id: `hw-${device.deviceId}`, // Use Real Device ID
        name: device.label,
        type: isAudioOnly ? DeviceType.AUDIO_INTERFACE : (isCaptureCard ? DeviceType.HDMI : DeviceType.USB_CAMERA),
        protocol: StreamProtocol.HARDWARE, // Direct Hardware Access
        role: isAudioOnly ? StreamRole.AUDIO_ONLY : StreamRole.BOTH,
        status: ConnectionStatus.CONNECTED,
        latencyMs: isCaptureCard ? 45 : 10, 
        batteryLevel: 100,
        signalStrength: 100, // Wired
        isLive: false,
        deviceId: device.deviceId, // CRITICAL: Pass device ID for getUserMedia
        stats: { 
            bitrate: isAudioOnly ? 0.3 : 250.0, // Audio low, Video high (uncompressed)
            fps: isAudioOnly ? 0 : 30, // Default to 30 for webcams often
            jitter: 0, 
            packetLoss: 0,
            format: isAudioOnly ? VideoFormat.RAW : VideoFormat.NV12,
            resolution: isAudioOnly ? 'Audio Only' : '1080p30'
        },
        thumbnailUrl: isAudioOnly ? 'https://picsum.photos/seed/audio/800/450' : 'https://picsum.photos/seed/camera/800/450',
        ipAddress: 'Localhost'
    };
};


export const initiateQrHandshake = (token: string): Promise<CameraSource> => {
    // Simulates validating the token scanned from a QR code
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token.length > 5) {
                resolve({
                    id: `qr-cam-${Date.now()}`,
                    name: 'Guest Cam (QR)',
                    type: DeviceType.SMARTPHONE,
                    protocol: StreamProtocol.SRT, // SRT preferred for WAN/4G
                    role: StreamRole.BOTH,
                    status: ConnectionStatus.CONNECTED,
                    latencyMs: 120, // Higher latency for QR/Remote sources typically
                    batteryLevel: 50,
                    signalStrength: 75,
                    isLive: false,
                    stats: { 
                        bitrate: 3.5, 
                        fps: 30, 
                        jitter: 15, 
                        packetLoss: 0.1,
                        format: VideoFormat.H264, // Remote stream
                        resolution: '1080p30'
                    },
                    thumbnailUrl: 'https://picsum.photos/seed/guest/800/450',
                    ipAddress: '10.0.0.5'
                });
            } else {
                reject("Invalid Token");
            }
        }, 1500);
    });
};

// Heartbeat Monitor (Simulated)
export const checkConnectionHealth = (source: CameraSource): ConnectionStatus => {
    // Logic: In a real app, this checks last packet arrival time
    if (source.signalStrength <= 0) return ConnectionStatus.LOST;
    if (source.signalStrength < 30) return ConnectionStatus.UNSTABLE;
    if (source.stats.packetLoss && source.stats.packetLoss > 5.0) return ConnectionStatus.UNSTABLE;
    return ConnectionStatus.CONNECTED;
};

// --- CHAOS MONKEY METHODS (For Field Testing) ---

export const simulateDeviceFailure = (cameras: CameraSource[], targetId: string): CameraSource[] => {
    return cameras.map(c => {
        if (c.id === targetId) {
            return { ...c, status: ConnectionStatus.LOST, signalStrength: 0, stats: { ...c.stats, fps: 0, bitrate: 0 } };
        }
        return c;
    });
};

export const simulateNetworkLag = (cameras: CameraSource[]): CameraSource[] => {
    return cameras.map(c => ({
        ...c,
        status: ConnectionStatus.UNSTABLE,
        latencyMs: c.latencyMs + Math.random() * 500, // Add massive lag
        stats: { ...c.stats, packetLoss: Math.random() * 15, jitter: 100 }
    }));
};
