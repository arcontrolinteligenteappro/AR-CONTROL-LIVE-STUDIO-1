
import { VideoEngineStats, CameraSource, ReplayClip } from '../types';

let currentStats: VideoEngineStats = {
    renderResolution: '1080p',
    temperatureC: 36.5,
    gpuLoad: 35,
    ramUsage: 450, // MB
    survivalMode: false,
    droppedFrames: 0,
    // Fix: Using correct property names from VideoEngineStats interface
    replayBufferUsage: 15, 
    isReplaying: false,
    replaySpeed: 1.0,
    safeZonesEnabled: true,
    watchdogPulse: 0,
    thermalState: 'NOMINAL'
};

// Simulates the Video Engine Loop
export const tickEngine = (activeSourcesCount: number, forceStress: boolean = false): VideoEngineStats => {
    // 1. Simulate Thermal Load
    const loadFactor = activeSourcesCount * 8.5 + (forceStress ? 30 : 0); 
    const baseLoad = 20;
    const newGpuLoad = Math.min(99, baseLoad + loadFactor + (Math.random() * 5));

    let targetTemp = 35 + (newGpuLoad * 0.15); // Max around 50C
    if (currentStats.survivalMode) targetTemp -= 5; 

    const newTemp = currentStats.temperatureC + (targetTemp - currentStats.temperatureC) * 0.05;

    let newThermalState: VideoEngineStats['thermalState'] = 'NOMINAL';
    let survivalMode = currentStats.survivalMode;

    if (newTemp > 45) newThermalState = 'CRITICAL';
    else if (newTemp > 40) newThermalState = 'THROTTLING';

    if (newTemp > 42) {
        survivalMode = true;
    } else if (newTemp < 38) {
        survivalMode = false;
    }

    let newResolution: VideoEngineStats['renderResolution'] = '1080p';
    if (survivalMode) newResolution = '720p'; 
    else if (newThermalState === 'THROTTLING') newResolution = '1080p';

    let newBuffer = currentStats.replayBufferUsage || 0;
    if (survivalMode) {
        newBuffer = Math.max(0, newBuffer - 5); 
    } else if (newBuffer < 100) {
        newBuffer += 0.5; 
    } else {
        newBuffer = 100;
    }

    const ramBase = 800;
    const ramUsage = ramBase + (newBuffer * 10) + (activeSourcesCount * 150);

    currentStats = {
        ...currentStats,
        renderResolution: newResolution,
        thermalState: newThermalState,
        temperatureC: parseFloat(newTemp.toFixed(1)),
        gpuLoad: newGpuLoad,
        ramUsage: Math.floor(ramUsage),
        droppedFrames: survivalMode ? (currentStats.droppedFrames || 0) + Math.floor(Math.random() * 10) : (currentStats.droppedFrames || 0),
        replayBufferUsage: newBuffer,
        survivalMode: survivalMode
    };

    return currentStats;
};

export const triggerInstantReplay = (durationSec: number, speed: number = 0.5) => {
    if (currentStats.survivalMode) return; 
    
    currentStats.isReplaying = true;
    currentStats.replaySpeed = speed;
    
    setTimeout(() => {
        currentStats.isReplaying = false;
        currentStats.replaySpeed = 1.0;
    }, durationSec * 1000);
};

export const stopReplay = () => {
    currentStats.isReplaying = false;
    currentStats.replaySpeed = 1.0;
};

export const generateReplayClip = (source: CameraSource, duration: number, label: string, gameTime: string): ReplayClip => {
    return {
        id: `clip-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gameTime: gameTime,
        duration,
        sourceId: source.id,
        thumbnailUrl: source.thumbnailUrl || 'https://picsum.photos/seed/replay/300/200',
        label,
        tags: ['LIVE'],
        speed: 0.5
    };
};
