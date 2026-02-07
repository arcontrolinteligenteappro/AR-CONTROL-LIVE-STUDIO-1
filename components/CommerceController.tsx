
import React from 'react';
import { CommerceState, Product } from '../types';
import { ShoppingCart, DollarSign, Award, Package, Play, StopCircle, Ban } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

interface CommerceControllerProps {
    state: CommerceState;
    onUpdate: (updates: Partial<CommerceState>) => void;
}

const CommerceController: React.FC<CommerceControllerProps> = ({ state, onUpdate }) => {
    
    const startSale = (product: Product) => {
        onUpdate({
            activeProduct: product,
            saleStatus: 'ACTIVE',
            overlayVisible: true,
            isEnabled: true
        });
    };

    const stopSale = () => {
        onUpdate({ saleStatus: 'ENDED', overlayVisible: false });
    };

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Sales Summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-green-500" /> Revenue Live
                    </h3>
                    <span className="text-xl font-black text-green-400">${state.revenue.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Ventas</span>
                        <span className="text-lg font-bold">{state.winners.length}</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Stock Activo</span>
                        <span className="text-lg font-bold text-yellow-500">{state.activeProduct?.stock || 0}</span>
                    </div>
                </div>
            </div>

            {/* Catalog */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase">Catálogo de Productos</h4>
                {MOCK_PRODUCTS.map((p) => {
                    const isSoldOut = p.stock === 0;
                    return (
                        <div key={p.sku} className={`bg-zinc-900 p-2 rounded border transition-all flex gap-3 ${isSoldOut ? 'opacity-50 grayscale border-zinc-800' : 'border-zinc-800 hover:border-green-600'}`}>
                            <div className="relative w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                                <img src={p.imageUrl} className="w-full h-full object-contain" />
                                {isSoldOut && <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center"><Ban className="text-red-600 w-8 h-8"/></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-white truncate">{p.name}</div>
                                <div className="text-xs font-black text-green-400 mt-1">${p.price}</div>
                                <div className="text-[10px] text-zinc-500">Stock: {p.stock}</div>
                            </div>
                            <button 
                                onClick={() => startSale(p as any)}
                                disabled={isSoldOut || state.saleStatus === 'ACTIVE'}
                                className="self-center bg-zinc-800 hover:bg-green-600 p-2 rounded-full disabled:opacity-0"
                            >
                                <Play className="w-4 h-4 fill-current" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {state.saleStatus === 'ACTIVE' && (
                <button onClick={stopSale} className="w-full py-3 bg-red-600 text-white font-black uppercase rounded shadow-lg animate-pulse">
                    Finalizar Venta Activa
                </button>
            )}
        </div>
    );
};

export default CommerceController;
