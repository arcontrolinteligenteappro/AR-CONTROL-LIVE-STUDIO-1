
import React from 'react';
import { SceneLayer, ScoreboardState } from '../types';

interface Props {
  layers: SceneLayer[];
  scoreboard: ScoreboardState;
}

const SceneCompositor: React.FC<Props> = ({ layers, scoreboard }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {layers.filter(l => l.isVisible).sort((a, b) => a.zIndex - b.zIndex).map(layer => (
        <div 
          key={layer.id}
          className="absolute transition-all duration-500 ease-out"
          style={{
            top: `${layer.position.y}%`,
            left: `${layer.position.x}%`,
            transform: `translate(-50%, -50%) scale(${layer.position.scale})`,
            opacity: layer.opacity,
            zIndex: layer.zIndex
          }}
        >
          {layer.type === 'IMAGE' && <img src={layer.contentUrl} alt={layer.name} className="max-w-none drop-shadow-2xl" />}
          {layer.type === 'TEXT' && <span className="text-white font-black italic tracking-tighter text-shadow-lg uppercase">{layer.name}</span>}
        </div>
      ))}
    </div>
  );
};

export default SceneCompositor;
