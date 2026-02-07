
import { AudioChannel, AudioMasterState, AudioConsoleConfig } from '../types';

/**
 * ENGINE-AUDIO-DSP
 * Implementa las protecciones obligatorias P0 de AR CONTROL LIVE STUDIO.
 */
export const processProAudio = (
  channels: AudioChannel[],
  master: AudioMasterState,
  config: AudioConsoleConfig
): { channels: AudioChannel[], master: AudioMasterState } => {
  
  if (!config.enabled) return { channels, master };

  let newClipCount = master.clipCount;
  let finalMasterVol = master.masterVolume;
  
  // 1. Detección de Clipping y Auto Gain Guard
  let currentMaxPeak = 0;
  channels.forEach(ch => {
    if (!ch.isMuted && ch.meter > currentMaxPeak) currentMaxPeak = ch.meter;
  });

  if (currentMaxPeak > 98) {
    newClipCount++;
  }

  // Protección automática: 3 clips en ciclo -> reducir master
  if (config.autoGainGuard.enabled && newClipCount >= config.autoGainGuard.clipCountThreshold) {
    finalMasterVol = Math.max(0, finalMasterVol - config.autoGainGuard.autoReduceDb);
    newClipCount = 0;
    console.warn("[DSP] Auto Gain Guard Triggered: Reducing Master Gain.");
  }

  // 2. Master Limiter (P0)
  const limiterActive = currentMaxPeak > 95;

  // 3. Audio Follow Video (AFV) Logic
  // (Se implementa en el orquestador principal mediante comandos CSL)

  return {
    channels: channels.map(ch => ({
      ...ch,
      // En modo PRO, aplicamos un "Warmth" o EQ simulado si el usuario lo desea
      meter: ch.isMuted ? 0 : Math.min(100, ch.meter)
    })),
    master: {
      ...master,
      masterVolume: finalMasterVol,
      clipCount: newClipCount,
      limiterActive
    }
  };
};
