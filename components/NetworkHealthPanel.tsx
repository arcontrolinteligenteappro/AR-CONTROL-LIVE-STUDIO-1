
import React from 'react';
import { CameraSource, ConnectionStatus } from '../types';
import { Signal, Activity } from 'lucide-react';

interface NetworkHealthPanelProps {
    cameras: CameraSource[];
}

const NetworkHealthPanel: React.FC<NetworkHealthPanelProps> = ({ cameras }) => {
    return (
        <div className="w-full bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 backdrop-blur-sm overflow-hidden">
            <h3 className="text-xs font-bold text-zinc-400 uppercase mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Network Health Matrix
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] text-zinc-500 uppercase border-b border-zinc-800">
                            <th className="py-2 px-2 font-medium">Source</th>
                            <th className="py-2 px-2 font-medium">Type</th>
                            <th className="py-2 px-2 font-medium">Status</th>
                            <th className="py-2 px-2 font-medium">Signal</th>
                            <th className="py-2 px-2 font-medium">Loss %</th>
                            <th className="py-2 px-2 font-medium">Jitter</th>
                            <th className="py-2 px-2 font-medium">Bitrate</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-mono">
                        {cameras.map(cam => (
                            <tr key={cam.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                                <td className="py-2 px-2 font-bold text-zinc-300 truncate max-w-[120px]">{cam.name}</td>
                                <td className="py-2 px-2 text-zinc-500">{cam.type}</td>
                                <td className="py-2 px-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        cam.status === ConnectionStatus.CONNECTED ? 'bg-green-900/30 text-green-500' : 
                                        cam.status === ConnectionStatus.LOST ? 'bg-red-900/30 text-red-500' : 'bg-yellow-900/30 text-yellow-500'
                                    }`}>
                                        {cam.status}
                                    </span>
                                </td>
                                <td className="py-2 px-2">
                                    <div className="flex items-center gap-1.5">
                                        <Signal className={`w-3 h-3 ${cam.signalStrength > 70 ? 'text-green-500' : cam.signalStrength > 30 ? 'text-yellow-500' : 'text-red-500'}`} />
                                        <span>{cam.signalStrength}%</span>
                                    </div>
                                </td>
                                <td className="py-2 px-2">
                                    <span className={`${cam.stats.packetLoss > 2 ? 'text-red-500' : 'text-zinc-400'}`}>
                                        {cam.stats.packetLoss.toFixed(1)}%
                                    </span>
                                </td>
                                <td className="py-2 px-2 text-zinc-400">{cam.stats.jitter.toFixed(0)}ms</td>
                                <td className="py-2 px-2 text-blue-400">{cam.stats.bitrate.toFixed(1)} Mb</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NetworkHealthPanel;
