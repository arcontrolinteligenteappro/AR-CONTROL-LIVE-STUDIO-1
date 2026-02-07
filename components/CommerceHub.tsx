
import React from 'react';
import { CommerceState, Product } from '../types';
import { ShoppingCart, DollarSign, Package, Play, StopCircle, RefreshCcw } from 'lucide-react';

interface Props {
  state: CommerceState;
  onUpdate: (s: CommerceState) => void;
  products: Product[];
}

const CommerceHub: React.FC<Props> = ({ state, onUpdate, products }) => {
  const launchSale = (product: Product) => {
    onUpdate({ ...state, activeProduct: product, saleStatus: 'ACTIVE', overlayVisible: true });
  };

  const stopSale = () => {
    onUpdate({ ...state, saleStatus: 'IDLE', overlayVisible: false });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Resumen de Ventas */}
      <div className="bg-green-600/10 border border-green-500/30 p-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500 rounded-lg text-white">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[8px] font-bold text-green-500 uppercase">Ventas de Hoy</div>
            <div className="text-xl font-black text-white">${state.revenue.toFixed(2)}</div>
          </div>
        </div>
        <button className="text-zinc-500 hover:text-white transition-colors"><RefreshCcw className="w-4 h-4" /></button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black text-zinc-500 uppercase px-1">Inventario Live</span>
        {products.map(p => (
          <div key={p.sku} className={`bg-zinc-950 border p-2 rounded-lg flex items-center justify-between transition-all ${state.activeProduct?.sku === p.sku ? 'border-green-500 ring-1 ring-green-500/50' : 'border-zinc-800'}`}>
            <div className="flex items-center gap-3">
              <img src={p.imageUrl} className="w-10 h-10 rounded object-cover border border-zinc-800" />
              <div>
                <div className="text-xs font-bold text-zinc-200">{p.name}</div>
                <div className="text-[10px] text-zinc-500 font-mono">${p.price} • Stock: {p.stock}</div>
              </div>
            </div>
            
            {state.activeProduct?.sku === p.sku && state.saleStatus === 'ACTIVE' ? (
              <button 
                onClick={stopSale}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => launchSale(p)}
                disabled={state.saleStatus === 'ACTIVE'}
                className="p-2 bg-zinc-800 text-green-500 rounded-lg hover:bg-zinc-700 disabled:opacity-30 transition-all"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-1">
          <ShoppingCart className="w-3 h-3" /> Monitor de Chat (IA Sales)
        </div>
        <div className="text-[11px] text-zinc-600 italic text-center py-4 bg-black/30 rounded border border-dashed border-zinc-800">
          Esperando pedidos en vivo...
        </div>
      </div>
    </div>
  );
};

export default CommerceHub;
