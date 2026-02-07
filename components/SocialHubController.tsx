import React from 'react';
import { SocialState } from '../types';
import { MessageSquare, Play, Square, RefreshCcw, Monitor, Hash, ExternalLink } from 'lucide-react';

interface SocialHubControllerProps {
    state: SocialState;
    onUpdate: (updates: Partial<SocialState>) => void;
    onNext: () => void;
}

const SocialHubController: React.FC<SocialHubControllerProps> = ({ state, onUpdate, onNext }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-500" /> Social Hub
                </h3>
                <div className={`w-2 h-2 rounded-full ${state.isEnabled ? 'bg-green-500' : 'bg-zinc-700'}`}></div>
            </div>

            <div className="bg-zinc-950 rounded p-2 mb-3 border border-zinc-800 min-h-[60px] flex items-center justify-center text-center">
                {state.activeComment ? (
                    <div>
                        <span className="text-[10px] text-blue-400 font-bold block mb-1">ON AIR: @{state.activeComment.user}</span>
                        <p className="text-xs text-zinc-300 italic line-clamp-2">"{state.activeComment.message}"</p>
                    </div>
                ) : (
                    <span className="text-[10px] text-zinc-600 uppercase">No Overlay Active</span>
                )}
            </div>

            {/* Config: Filter & Monitor */}
            <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                    <Hash className="w-3 h-3 absolute left-2 top-2 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Filter..."
                        value={state.hashtagFilter || ''}
                        onChange={(e) => onUpdate({ hashtagFilter: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded py-1 pl-6 pr-2 text-[10px] text-white outline-none focus:border-pink-500"
                    />
                </div>
                <button 
                    onClick={() => onUpdate({ showOnMonitor: !state.showOnMonitor })}
                    className={`px-3 py-1 rounded border flex items-center gap-1 ${state.showOnMonitor ? 'bg-purple-900/30 text-purple-400 border-purple-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
                    title="Send Feed to Confidence Monitor"
                >
                    <ExternalLink className="w-3 h-3" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => onUpdate({ isEnabled: !state.isEnabled })}
                    className={`py-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 ${state.isEnabled ? 'bg-green-900/30 text-green-500 border border-green-500/50' : 'bg-zinc-800 text-zinc-400'}`}
                >
                    {state.isEnabled ? 'Engine On' : 'Engine Off'}
                </button>
                
                <button 
                    onClick={onNext}
                    disabled={!state.isEnabled}
                    className="py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-zinc-800 text-white rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1"
                >
                    <RefreshCcw className="w-3 h-3" /> Next Post
                </button>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
                <input 
                    type="checkbox" 
                    checked={state.activeComment !== null} 
                    onChange={() => onUpdate({ activeComment: state.activeComment ? null : state.queue[0] })}
                    disabled={!state.isEnabled}
                    className="accent-pink-500"
                />
                <span className="text-[10px] text-zinc-500 uppercase">Show Overlay (PGM)</span>
            </div>
        </div>
    );
};

export default SocialHubController;