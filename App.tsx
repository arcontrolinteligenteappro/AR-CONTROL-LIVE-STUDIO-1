
import React, { useState, useEffect } from 'react';
import { 
  FsmState, OperationMode, CameraSource, 
  ScoreboardState, AudioChannel, ConsoleState, AudioConsoleConfig, SportType, MatchStatus
} from './types';
import { MOCK_CAMERAS } from './constants';
import { SplashScreen } from './components/SplashScreen';
import MasterDesk from './components/ProConsole/MasterDesk';
import StudioMultiview from './components/StudioMultiview';
import SceneCompositor from './components/SceneCompositor';
import { csl } from './services/ControlSurfaceEngine';
import { processProAudio } from './services/AudioDSP';

const INITIAL_AUDIO_CONFIG: AudioConsoleConfig = {
  enabled: true,
  mode: 'BROADCAST',
  allowCrossfaderAudio: false,
  masterLimiter: { enabled: true, thresholdDb: -1.0, releaseMs: 120 },
  autoGainGuard: { enabled: true, clipCountThreshold: 3, autoReduceDb: 3 },
  safeHeadroom: { targetLUFS: -14, maxPeakDbfs: -1.0 }
};

const App: React.FC = () => {
  const [fsm, setFsm] = useState<FsmState>(FsmState.BOOT);
  
  // --- KERNEL CORE STATE (ARCLS v7.0) ---
  const [cameras, setCameras] = useState<CameraSource[]>(MOCK_CAMERAS);
  
  const [audioChannels, setAudioChannels] = useState<AudioChannel[]>(
    MOCK_CAMERAS.map(c => ({
      id: c.id, 
      label: c.name, 
      name: c.name,
      type: c.type,
      volume: 80, 
      meter: 0, 
      meterLevel: 0,
      peakLevel: 0,
      isMuted: false, 
      isSolo: false,
      isPfl: false,
      isLocked: false, 
      afv: false, 
      afvEnabled: false,
      isActiveByAfv: true,
      isDuckingTrigger: false,
      isDuckingTarget: true,
      duckingThreshold: 60,
      duckingReductionDb: 20,
      gainReduction: 0,
      gainDb: 0,
      delayMs: c.latencyMs,
      fx: { filter: 0, echo: 0, gain: 0 },
      eq: { low: 0, mid: 0, high: 0, lowCut: false }
    }))
  );
  
  const [masterAudio, setMasterAudio] = useState({ 
    masterVolume: 85, meterL: 0, meterR: 0, masterMeterL: 0, masterMeterR: 0, clipCount: 0, limiterActive: false, limiterEnabled: true, globalLock: false, isSceneActive: false, sceneAudioMode: 'MIX_LIVE' as any, isMasterMuted: false
  });

  const [scoreboard, setScoreboard] = useState<ScoreboardState>({
    sportType: SportType.SOCCER,
    homeName: 'REAL MADRID', 
    awayName: 'BARCELONA', 
    homeScore: 0, 
    awayScore: 0, 
    timer: '45:12', 
    period: 1, 
    isVisible: true,
    isTimerRunning: false,
    timerMinutes: 45,
    timerSeconds: 12,
    addedMinutes: 0,
    matchStatus: MatchStatus.FIRST_HALF,
    matchContext: { mode: 'REGULAR' },
    overlaySettings: { position: 'TOP_LEFT', opacity: 1, scale: 1, keepOnScenes: false }
  });
  
  const [consoleState, setConsoleState] = useState<ConsoleState>({
    activeMode: OperationMode.SPORTS,
    programId: 'cam-1',
    previewId: 'cam-2',
    transitionType: 'CUT',
    transitionMs: 500,
    isStreaming: false,
    isRecording: true,
    masterVolume: 85,
    audioConfig: INITIAL_AUDIO_CONFIG
  });

  // --- ORQUESTADOR CSL (Mission Critical Command Bus) ---
  useEffect(() => {
    csl.subscribe((cmd) => {
      switch (cmd.type) {
        case 'VIDEO_SWITCH_PREVIEW':
          setConsoleState(prev => ({ ...prev, previewId: cmd.payload }));
          break;
        case 'VIDEO_CUT':
          setConsoleState(prev => ({ 
            ...prev, 
            programId: prev.previewId, 
            previewId: prev.programId 
          }));
          break;
        case 'AUDIO_SET_GAIN':
          setAudioChannels(prev => prev.map(ch => ch.id === cmd.payload.id ? { ...ch, volume: cmd.payload.val } : ch));
          break;
        case 'AUDIO_TOGGLE_LOCK':
          setAudioChannels(prev => prev.map(ch => ch.id === cmd.payload ? { ...ch, isLocked: !ch.isLocked } : ch));
          break;
        case 'AUDIO_TOGGLE_MUTE':
          setAudioChannels(prev => prev.map(ch => ch.id === cmd.payload ? { ...ch, isMuted: !ch.isMuted } : ch));
          break;
        case 'SPORT_EVENT':
          if (cmd.payload.type === 'GOAL') {
             setScoreboard(prev => cmd.payload.team === 'HOME' 
                ? { ...prev, homeScore: prev.homeScore + 1 }
                : { ...prev, awayScore: prev.awayScore + 1 }
             );
          }
          break;
        case 'SYSTEM_PANIC':
           setConsoleState(prev => ({ ...prev, programId: 'cam-1', previewId: 'cam-2', isStreaming: false }));
           console.error("[KERNEL] PANIC SAFE ACTIVATED.");
           break;
      }
    });
  }, []);

  // --- ENGINE HEARTBEAT: Pro-DSP Thread Simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (fsm !== FsmState.LIVE) return;

      setAudioChannels(prevChannels => {
        // Simulación de entrada de señal (Meter)
        const noisyChannels = prevChannels.map(ch => {
          const baseNoisySignal = ch.isMuted ? 0 : Math.random() * (ch.volume / 100) * 105;
          return {
            ...ch,
            meter: baseNoisySignal
          };
        });

        // Aplicamos el motor de procesamiento Audio Guard (P0)
        const result = processProAudio(noisyChannels, masterAudio as any, consoleState.audioConfig);
        
        // Sincronizar estado Master si el DSP disparó protecciones automáticas
        if (result.master.masterVolume !== masterAudio.masterVolume) {
            setMasterAudio(prev => ({
               ...prev,
               masterVolume: result.master.masterVolume,
               clipCount: result.master.clipCount,
               limiterActive: result.master.limiterActive
            }));
        }

        return result.channels;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [fsm, masterAudio.masterVolume, consoleState.audioConfig]);

  // Boot management
  if (fsm === FsmState.BOOT) return <SplashScreen onComplete={() => setFsm(FsmState.LIVE)} />;

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans select-none touch-none">
      
      {/* 📺 STAGE A: MONITOR MULTIVIEW (Director View) */}
      <section className="flex-1 relative bg-zinc-950 overflow-hidden shadow-inner">
        <StudioMultiview 
          cameras={cameras}
          programId={consoleState.programId}
          previewId={consoleState.previewId}
          onSelectPreview={(id) => csl.emit('VIDEO_SWITCH_PREVIEW', id)}
          onTake={() => csl.emit('VIDEO_CUT')}
          scoreboard={scoreboard}
        />
        <SceneCompositor layers={[]} scoreboard={scoreboard} />
      </section>

      {/* 🎛️ STAGE B: MASTER CONTROL CONSOLE (Operator View) */}
      <section className="h-[440px] shrink-0">
        <MasterDesk 
          cameras={cameras}
          audioChannels={audioChannels}
          scoreboard={scoreboard}
          consoleState={consoleState}
        />
      </section>

    </div>
  );
};

export default App;
