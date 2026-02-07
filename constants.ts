
import { CameraSource, DeviceType, StreamProtocol, Product, Team, MatchOfficial, VoiceProfile, PlayerStatus, ConnectionStatus, StreamRole, VideoFormat } from './types';

export const MOCK_CAMERAS: CameraSource[] = [
  {
    id: 'cam-1',
    name: 'Sony PTZ Master (NDI)',
    type: DeviceType.PTZ_CAMERA,
    protocol: StreamProtocol.NDI,
    status: ConnectionStatus.CONNECTED,
    latencyMs: 35,
    batteryLevel: 100,
    signalStrength: 100,
    isLive: true,
    stats: { bitrate: 12.5, fps: 60, resolution: '1080p60', packetLoss: 0, jitter: 2, format: VideoFormat.YUV_420 },
    thumbnailUrl: 'https://picsum.photos/seed/cam1/300/170',
    role: StreamRole.BOTH
  },
  {
    id: 'cam-2',
    name: 'DJI Drone SkyView',
    type: DeviceType.DRONE,
    protocol: StreamProtocol.SRT,
    status: ConnectionStatus.CONNECTED,
    latencyMs: 120,
    batteryLevel: 42,
    signalStrength: 78,
    isLive: false,
    stats: { bitrate: 6.0, fps: 30, resolution: '1080p30', packetLoss: 0.1, jitter: 15, format: VideoFormat.H264 },
    thumbnailUrl: 'https://picsum.photos/seed/drone/300/170',
    role: StreamRole.VIDEO_ONLY
  },
  {
    id: 'cam-3',
    name: 'GoPro Hero 12 (SRT)',
    type: DeviceType.GOPRO,
    protocol: StreamProtocol.SRT,
    status: ConnectionStatus.UNSTABLE,
    latencyMs: 250,
    batteryLevel: 15,
    signalStrength: 35,
    isLive: false,
    stats: { bitrate: 2.5, fps: 60, resolution: '720p60', packetLoss: 4.5, jitter: 120, format: VideoFormat.H264 },
    thumbnailUrl: 'https://picsum.photos/seed/gopro/300/170',
    role: StreamRole.BOTH
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { sku: 'JSY-01', name: 'Jersey Oficial 2024', price: 89.99, stock: 50, imageUrl: 'https://picsum.photos/seed/jersey/100/100' },
  { sku: 'CAP-02', name: 'Gorra Team Spirit', price: 24.99, stock: 100, imageUrl: 'https://picsum.photos/seed/cap/100/100' }
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 't-1',
    name: 'Real Madrid',
    shortName: 'RMA',
    primaryColor: '#FFFFFF',
    logoUrl: 'https://picsum.photos/seed/rma/100/100',
    coach: 'Carlo Ancelotti',
    players: [
      { id: 'p1', number: 7, name: 'Vinícius Jr.', position: 'FW', status: PlayerStatus.STARTER, order: 1 },
      { id: 'p2', number: 5, name: 'Jude Bellingham', position: 'MF', status: PlayerStatus.STARTER, order: 2 }
    ]
  },
  {
    id: 't-2',
    name: 'FC Barcelona',
    shortName: 'BAR',
    primaryColor: '#A50044',
    logoUrl: 'https://picsum.photos/seed/bar/100/100',
    coach: 'Hansi Flick',
    players: [
      { id: 'p3', number: 9, name: 'Robert Lewandowski', position: 'FW', status: PlayerStatus.STARTER, order: 1 },
      { id: 'p4', number: 8, name: 'Pedri', position: 'MF', status: PlayerStatus.STARTER, order: 2 }
    ]
  }
];

export const MOCK_OFFICIALS: MatchOfficial[] = [
  { id: 'off-1', name: 'Piero Maza', role: 'REFEREE' },
  { id: 'off-2', name: 'Facundo Tello', role: 'JUDGE' }
];

export const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'es-MX-1', name: 'Narrador Pro LatAm', lang: 'es-MX', gender: 'MALE', provider: 'CLOUD_AI' },
  { id: 'es-ES-1', name: 'Locutor Castizo', lang: 'es-ES', gender: 'MALE', provider: 'LOCAL' }
];
