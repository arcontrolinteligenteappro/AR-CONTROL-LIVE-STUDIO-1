
import { AudioChannel, AudioMasterState, CameraSource, DeviceType, SceneAudioMode } from '../types';

/**
 * SIMULATED DSP ENGINE (Digital Signal Processing)
 * In the real Android app, this runs in C++ using Oboe/AAudio.
 */

const DUCKING_ATTACK = 0.1;
const DUCKING_RELEASE = 0.05;

export const processAudioFrame = (
    channels: AudioChannel[], 
    programId: string,
    masterState: AudioMasterState
): { channels: AudioChannel[], master: AudioMasterState } => {
    
    // 1. Identify Ducking Trigger Activity
    let isDuckingActive = false;
    
    channels.forEach(ch => {
        if (ch.isDuckingTrigger && !ch.isMuted) {
            // Simulate signal presence for triggers (random fluctuation if not muted)
            const signal = Math.random() * 80; 
            if (ch.duckingThreshold && signal > ch.duckingThreshold) {
                isDuckingActive = true;
            }
        }
    });

    // 2. Process Individual Channels
    const processedChannels = channels.map(ch => {
        // --- Input Simulation ---
        // Drone audio is usually extremely loud/noisy, simplified here
        const baseSignal = ch.isMuted ? 0 : (Math.random() * 40 + (ch.volume / 2)); 
        
        // --- Audio Follow Video (AFV) Logic ---
        // Requirement: Camera switch does NOT change audio unless configured.
        // We use 'isActiveByAfv' to gate the signal. 
        // If afvEnabled is FALSE, channel is ALWAYS OPEN (independent).
        let activeByAfv = true;
        if (ch.afvEnabled) {
            if (ch.id !== programId) {
                activeByAfv = false; 
            }
        }

        // --- SCENE / COMMERCIAL BREAK LOGIC ---
        // If we are in a scene (Ad/Intro) and mode is SOLO_SCENE, we force mute all inputs.
        // In a real app, the Ad's audio runs on a separate internal channel not listed here.
        let activeBySceneRule = true;
        if (masterState.isSceneActive && masterState.sceneAudioMode === SceneAudioMode.SOLO_SCENE) {
            activeBySceneRule = false;
        }

        // --- Ducking Logic (Sidechain) ---
        let currentReduction = ch.gainReduction || 0;
        let targetReduction = 0;

        if (ch.isDuckingTarget && isDuckingActive && !ch.isDuckingTrigger) {
            targetReduction = ch.duckingReductionDb || 0; // Use per-channel reduction amount
        }

        // Smooth compression envelope
        if (targetReduction > currentReduction) {
            currentReduction += (targetReduction - currentReduction) * DUCKING_ATTACK;
        } else {
            currentReduction += (targetReduction - currentReduction) * DUCKING_RELEASE;
        }

        // --- Final Meter Calculation ---
        let postFaderLevel = baseSignal * (ch.volume / 100);
        
        // Apply EQ Gain (Simplified Simulation)
        // Boosting bass/treble adds perception of volume
        if (ch.eq) {
            const eqFactor = (ch.eq.low * 0.5 + ch.eq.mid * 0.3 + ch.eq.high * 0.4) / 10;
            postFaderLevel = postFaderLevel * (1 + eqFactor);
        }

        // Apply Gates (AFV or Scene)
        if ((ch.afvEnabled && !activeByAfv) || !activeBySceneRule) {
            postFaderLevel = 0;
        }

        // Apply Ducking
        postFaderLevel = Math.max(0, postFaderLevel - currentReduction);

        return {
            ...ch,
            meterLevel: postFaderLevel,
            isActiveByAfv: activeByAfv,
            gainReduction: currentReduction
        };
    });

    // 3. Process Master Mix
    let sumL = 0;
    let sumR = 0;
    processedChannels.forEach(ch => {
        sumL += (ch.meterLevel || 0);
        sumR += (ch.meterLevel || 0) * 0.95; // Slight stereo variance
    });

    // Master Volume
    let masterL = sumL * (masterState.masterVolume / 100);
    let masterR = sumR * (masterState.masterVolume / 100);

    // Hard Limiter (Simulated)
    if (masterState.limiterEnabled) {
        masterL = Math.min(95, masterL);
        masterR = Math.min(95, masterR);
    } else {
        masterL = Math.min(100, masterL);
        masterR = Math.min(100, masterR);
    }

    return {
        channels: processedChannels,
        master: {
            ...masterState,
            masterMeterL: masterL,
            masterMeterR: masterR
        }
    };
};

// Factory to initialize audio channels from camera sources
export const initAudioChannels = (sources: CameraSource[]): AudioChannel[] => {
    return sources.map(s => ({
        id: s.id,
        label: s.name, // Satisfy original AudioChannel
        name: s.name,
        type: s.type,
        volume: s.type === DeviceType.DRONE ? 30 : 85, // Drones lower by default
        gainDb: 0,
        meter: 0, // Satisfy original AudioChannel
        meterLevel: 0,
        peakLevel: 0,
        isMuted: false,
        isSolo: false,
        isPfl: false,
        isLocked: false,
        afv: false, // Satisfy original AudioChannel
        fx: { filter: 0, echo: 0, gain: 0 },
        eq: { low: 0, mid: 0, high: 0, lowCut: false },
        delayMs: s.latencyMs, // Auto-match video latency initially
        afvEnabled: false, 
        isActiveByAfv: true,
        isDuckingTrigger: s.id === 'cam-1', // Assume Cam 1 is commentator for demo
        isDuckingTarget: s.id !== 'cam-1',
        gainReduction: 0,
        duckingThreshold: 60,
        duckingReductionDb: 20
    }));
};
