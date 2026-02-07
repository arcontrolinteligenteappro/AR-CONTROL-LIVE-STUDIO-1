import React, { useState } from 'react';
import { X, Save, Image, Palette, Upload } from 'lucide-react';

interface TeamEditorModalProps {
    side: 'HOME' | 'AWAY';
    name: string;
    color: string;
    logoUrl?: string;
    onSave: (data: { name: string; color: string; logoUrl?: string }) => void;
    onClose: () => void;
}

const TeamEditorModal: React.FC<TeamEditorModalProps> = ({ side, name, color, logoUrl, onSave, onClose }) => {
    const [localName, setLocalName] = useState(name);
    const [localColor, setLocalColor] = useState(color);
    const [localLogo, setLocalLogo] = useState(logoUrl || '');

    // Simulating file upload
    const handleLogoUpload = () => {
        const logos = [
            'https://picsum.photos/seed/t1/100/100',
            'https://picsum.photos/seed/t2/100/100',
            'https://picsum.photos/seed/t3/100/100',
            'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png'
        ];
        const rand = logos[Math.floor(Math.random() * logos.length)];
        setLocalLogo(rand);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-sm overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-3 border-b border-zinc-800 bg-zinc-950">
                    <h3 className="font-bold text-white uppercase text-sm">
                        Edit {side} Team
                    </h3>
                    <button onClick={onClose}><X className="w-4 h-4 text-zinc-500 hover:text-white"/></button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Team Name</label>
                        <input 
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white font-bold"
                        />
                    </div>

                    {/* Logo */}
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Team Logo</label>
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center overflow-hidden relative group">
                                {localLogo ? (
                                    <img src={localLogo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <Image className="w-6 h-6 text-zinc-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <button 
                                    onClick={handleLogoUpload}
                                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-xs text-white w-full justify-center"
                                >
                                    <Upload className="w-3 h-3" /> Select Image
                                </button>
                                <p className="text-[9px] text-zinc-500 mt-1">Supports PNG with transparency.</p>
                            </div>
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Team Color</label>
                        <div className="flex gap-2 items-center">
                            <input 
                                type="color" 
                                value={localColor}
                                onChange={(e) => setLocalColor(e.target.value)}
                                className="w-10 h-10 bg-transparent border-none cursor-pointer"
                            />
                            <div className="flex-1 bg-zinc-950 border border-zinc-700 rounded p-2 text-xs font-mono text-zinc-400">
                                {localColor}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            onSave({ name: localName, color: localColor, logoUrl: localLogo });
                            onClose();
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded uppercase text-xs flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamEditorModal;