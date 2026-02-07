
export enum FsmState {
  BOOT = 'BOOT',
  LIVE = 'LIVE',
  PANIC = 'PANIC'
}

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  UNSTABLE = 'UNSTABLE',
  LOST = 'LOST',
  RECONNECTING = 'RECONNECTING'
}

export enum StreamRole {
  BOTH = 'BOTH',
  VIDEO_ONLY = 'VIDEO_ONLY',
  AUDIO_ONLY = 'AUDIO_ONLY'
}

export enum VideoFormat {
  YUV_420 = 'YUV_420',
  H264 = 'H264',
  NV12 = 'NV12',
  RAW = 'RAW'
}

export enum DJIConnectionMode {
  RC_USB = 'RC_USB',
  FLY_RTMP = 'FLY_RTMP'
}

export enum TransitionType {
  CUT = 'CUT',
  MIX = 'MIX',
  WIPE = 'WIPE',
  FADE = 'FADE'
}

export enum SportType {
  SOCCER = 'SOCCER',
  INDOOR_SOCCER = 'INDOOR_SOCCER',
  BASEBALL = 'BASEBALL',
  BASKETBALL = 'BASKETBALL',
  TENNIS = 'TENNIS'
}

export enum SportEvent {
  GOAL = 'GOAL',
  FOUL = 'FOUL',
  TIMEOUT = 'TIMEOUT',
  SET_POINT = 'SET_POINT',
  STRIKE = 'STRIKE',
  HOME_RUN = 'HOME_RUN'
}

export enum MatchStatus {
  PRE_MATCH = 'PRE_MATCH',
  FIRST_HALF = 'FIRST_HALF',
  HALFTIME = 'HALFTIME',
  SECOND_HALF = 'SECOND_HALF',
  FULL_TIME = 'FULL_TIME'
}

export enum BroadcastPhase {
  PRE_SHOW = 'PRE_SHOW',
  COUNTDOWN = 'COUNTDOWN',
  LIVE = 'LIVE',
  POST_SHOW = 'POST_SHOW'
}

export enum StreamPlatform {
  YOUTUBE = 'YOUTUBE',
  TWITCH = 'TWITCH',
  TIKTOK = 'TIKTOK',
  FACEBOOK = 'FACEBOOK',
  CUSTOM_RTMP = 'CUSTOM_RTMP'
}

export enum SceneAudioMode {
  MIX_LIVE = 'MIX_LIVE',
  SOLO_SCENE = 'SOLO_SCENE'
}

export enum TestPhase {
  PHASE_1_NETWORK = 'PHASE_1_NETWORK',
  PHASE_2_LOAD = 'PHASE_2_LOAD',
  PHASE_3_PRIVATE = 'PHASE_3_PRIVATE',
  PHASE_4_ERROR = 'PHASE_4_ERROR',
  PHASE_5_LIVE = 'PHASE_5_LIVE'
}

export enum BroadcastOverlayType {
  NONE = 'NONE',
  MATCH_INTRO = 'MATCH_INTRO',
  REFEREES = 'REFEREES',
  LINEUP_HOME = 'LINEUP_HOME',
  LINEUP_AWAY = 'LINEUP_AWAY'
}

export enum PlayerStatus {
  STARTER = 'STARTER',
  SUB = 'SUB',
  RESERVE = 'RESERVE'
}

export enum DeviceType {
  SMARTPHONE = 'SMARTPHONE',
  GOPRO = 'GOPRO',
  DRONE = 'DRONE',
  HDMI = 'HDMI',
  USB_CAMERA = 'USB_CAMERA',
  AUDIO_INTERFACE = 'AUDIO_INTERFACE',
  GENERIC_IP = 'GENERIC_IP',
  PTZ_CAMERA = 'PTZ_CAMERA'
}

export enum StreamProtocol {
  NDI = 'NDI',
  SRT = 'SRT',
  RTMP = 'RTMP',
  RTSP = 'RTSP', 
  USB = 'USB',
  HARDWARE = 'HARDWARE',
  HTTP_HLS = 'HTTP_HLS'
}

export enum OperationMode {
  GENERAL = 'GENERAL',
  PODCAST = 'PODCAST',
  SPORTS = 'SPORTS',
  COMMERCE = 'COMMERCE'
}

export interface StreamStats {
  bitrate: number;
  timestamp: number;
}

export interface HardwareDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput';
  groupId: string;
  portLabel: string;
}

export interface VideoEngineStats {
  renderResolution: '1080p' | '720p';
  temperatureC: number;
  gpuLoad: number;
  ramUsage: number;
  survivalMode: boolean;
  droppedFrames: number;
  replayBufferUsage: number;
  isReplaying: boolean;
  replaySpeed: number;
  safeZonesEnabled: boolean;
  watchdogPulse: number;
  thermalState: 'NOMINAL' | 'THROTTLING' | 'CRITICAL';
}

export interface ReplayClip {
  id: string;
  timestamp: string;
  gameTime: string;
  duration: number;
  sourceId: string;
  thumbnailUrl: string;
  label: string;
  tags: string[];
  speed: number;
}

export interface AISuggestion {
  type: 'CUT' | 'REPLAY' | 'COMMENTARY' | 'INFO' | 'SALE_CONFIRM';
  reason: string;
  targetId?: string;
  duration?: number;
  sku?: string;
}

export interface Product {
  sku: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface Player {
  id: string;
  number: number;
  name: string;
  position: string;
  status: PlayerStatus;
  order: number;
  baseballStats?: BaseballStats;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  logoUrl?: string;
  coach: string;
  players: Player[];
}

export interface MatchOfficial {
  id: string;
  name: string;
  role: 'REFEREE' | 'JUDGE' | 'VAR' | 'LINE_JUDGE';
}

export interface VoiceProfile {
  id: string;
  name: string;
  lang: string;
  gender: 'MALE' | 'FEMALE';
  provider: 'CLOUD_AI' | 'LOCAL';
}

export interface VoiceState {
  isEnabled: boolean;
  selectedVoiceId: string;
  isSpeaking: boolean;
  volume: number;
  profiles: VoiceProfile[];
  history: string[];
}

export interface BaseballStats {
  balls: number;
  strikes: number;
  outs: number;
  inningTop: boolean;
  avg?: string;
  homeRuns?: number;
}

export interface ScoreboardState {
  sportType: SportType;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  timer: string;
  period: number;
  isVisible: boolean;
  isTimerRunning: boolean;
  timerMinutes: number;
  timerSeconds: number;
  addedMinutes: number;
  addedSeconds?: number;
  matchStatus: MatchStatus;
  matchContext: { mode: string };
  overlaySettings: {
    position: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT';
    opacity: number;
    scale: number;
    keepOnScenes: boolean;
  };
  baseballStats?: BaseballStats;
  homeColor?: string;
  awayColor?: string;
  homeLogo?: string;
  awayLogo?: string;
  homeTeamId?: string;
  awayTeamId?: string;
  activePlayerId?: number;
  activePlayerName?: string;
  activePlayerStats?: any;
  homeFouls?: number;
  awayFouls?: number;
  isShootout?: boolean;
  targetDuration?: number;
}

export interface AudioConsoleConfig {
  enabled: boolean;
  mode: 'BROADCAST' | 'DJ';
  allowCrossfaderAudio: boolean;
  masterLimiter: {
    enabled: boolean;
    thresholdDb: number;
    releaseMs: number;
  };
  autoGainGuard: {
    enabled: boolean;
    clipCountThreshold: number;
    autoReduceDb: number;
  };
  safeHeadroom: {
    targetLUFS: number;
    maxPeakDbfs: number;
  }
}

export interface AudioChannel {
  id: string;
  label: string;
  name: string;
  type: DeviceType;
  volume: number;
  meter: number;
  meterLevel: number;
  peakLevel: number;
  isMuted: boolean;
  isSolo: boolean;
  isPfl: boolean;
  isLocked: boolean; // Mic Master Lock
  afv: boolean;
  afvEnabled: boolean;
  isActiveByAfv: boolean;
  isDuckingTrigger: boolean;
  isDuckingTarget: boolean;
  duckingThreshold: number;
  duckingReductionDb: number;
  gainReduction: number;
  gainDb: number;
  delayMs: number;
  fx: { filter: number; echo: number; gain: number };
  eq: { low: number; mid: number; high: number; lowCut: boolean };
  compression?: { threshold: number; ratio: number; active: boolean };
  gate?: { threshold: number; active: boolean };
}

export interface AudioMasterState {
  masterVolume: number;
  meterL: number;
  meterR: number;
  masterMeterL: number;
  masterMeterR: number;
  clipCount: number;
  limiterActive: boolean;
  limiterEnabled: boolean;
  globalLock: boolean;
  isSceneActive: boolean;
  sceneAudioMode: SceneAudioMode;
  isMasterMuted: boolean;
}

export interface CameraSource {
  id: string;
  name: string;
  type: DeviceType;
  protocol: StreamProtocol;
  status: ConnectionStatus;
  latencyMs: number;
  batteryLevel: number;
  signalStrength: number;
  isLive: boolean;
  thumbnailUrl: string;
  stats: { 
    bitrate: number; 
    fps: number; 
    resolution: string; 
    packetLoss: number; 
    jitter: number; 
    format: VideoFormat;
  };
  role: StreamRole;
  deviceId?: string;
  ipAddress?: string;
  facingMode?: 'USER' | 'ENVIRONMENT';
  gimbal?: { pitch: number; yaw: number };
  ptz?: PTZState;
  djiMode?: DJIConnectionMode;
}

export interface PTZState {
  pan: number;
  tilt: number;
  zoom: number;
  presets: { id: number; pan: number; tilt: number; zoom: number }[];
}

export interface ConsoleState {
  activeMode: OperationMode;
  programId: string;
  previewId: string;
  transitionType: TransitionType | 'CUT' | 'FADE' | 'WIPE';
  transitionMs: number;
  isStreaming: boolean;
  isRecording: boolean;
  masterVolume: number;
  audioConfig: AudioConsoleConfig;
}

export interface SceneLayer {
  id: string;
  name: string;
  type: 'IMAGE' | 'TEXT';
  contentUrl?: string;
  isVisible: boolean;
  zIndex: number;
  position: { x: number; y: number; scale: number };
  opacity: number;
}

export interface SceneAsset {
  id: string;
  type: 'AD' | 'INTRO' | 'AUDIO';
  name: string;
  thumbnailUrl: string;
  duration: number;
  loop: boolean;
  volume: number;
}

export interface EventConfig {
  isConfigured: boolean;
  sport: SportType;
  metadata: {
    leagueName: string;
    venue: string;
    city: string;
    date: string;
    weather: string;
  };
  homeTeam: Team;
  awayTeam: Team;
  officials: MatchOfficial[];
}

export interface SocialComment {
  id: string;
  platform: 'YOUTUBE' | 'TWITCH' | 'TWITTER' | 'FACEBOOK';
  user: string;
  message: string;
  avatarUrl: string;
}

export interface SocialState {
  isEnabled: boolean;
  activeComment: SocialComment | null;
  queue: SocialComment[];
  hashtagFilter: string;
  showOnMonitor: boolean;
}

export interface StreamingState {
  isStreaming: boolean;
  health: 'OFFLINE' | 'POOR' | 'EXCELLENT';
  broadcastPhase: BroadcastPhase;
  uptime: number;
  activeDestinations: StreamPlatform[];
  viewers: {
    total: number;
    platforms: {
      youtube: number;
      facebook: number;
      twitch: number;
      tiktok: number;
      rtmp: number;
    };
  };
  outputFormat: 'LANDSCAPE_16_9' | 'PORTRAIT_9_16' | 'SIMULCAST';
}

export interface RecordingState {
  isRecording: boolean;
}

export interface VirtualSetPreset {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

export interface VirtualSetState {
  isEnabled: boolean;
  currentBackgroundId: string;
  presets: VirtualSetPreset[];
  aiPrompt: string;
  chromaThreshold: number;
  coachTips: string[];
}

export interface ExternalMonitorState {
  isEnabled: boolean;
  mode: 'WIRELESS_CAST' | 'HDMI_WIRED' | null;
  status: 'DISCONNECTED' | 'SEARCHING' | 'CONNECTED';
  deviceName: string;
  viewMode: 'PROGRAM_MIRROR' | 'SOCIAL_FEED' | 'STATS';
  showSelfView: boolean;
  latencyMs: number;
}

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  logoUrl: string;
  position: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT';
  opacity: number;
}

export interface CommerceState {
  isEnabled: boolean;
  activeProduct: Product | null;
  saleStatus: 'IDLE' | 'ACTIVE' | 'ENDED';
  winners: { userId: string; timestamp: number; sku: string; status: 'HELD' | 'CONFIRMED' }[];
  revenue: number;
  overlayVisible: boolean;
  queue: any[];
}

export interface BroadcastState {
  activeOverlay: BroadcastOverlayType;
  introTitle: string;
  introSubtitle: string;
  refereeNames: string[];
  graphicsOpacity: number;
  graphicsColor: string;
}

export type CommandType = 
  | 'VIDEO_SWITCH_PREVIEW' 
  | 'VIDEO_CUT' 
  | 'AUDIO_SET_GAIN' 
  | 'AUDIO_TOGGLE_LOCK' 
  | 'AUDIO_TOGGLE_MUTE' 
  | 'SPORT_EVENT' 
  | 'SYSTEM_PANIC' 
  | 'SELECT_PGM' 
  | 'SELECT_PVW' 
  | 'CUT' 
  | 'AUTO' 
  | 'VIDEO_LOAD_SCENE' 
  | 'VIDEO_AUTO' 
  | 'REPLAY_MARK' 
  | 'AUDIO_TOGGLE_AFV';

export interface BaseCommand {
  type: CommandType;
  payload: any;
  timestamp: number;
  priority: 'P0' | 'P1' | 'P2';
}
