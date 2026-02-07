
import { CommerceState, Product } from '../types';

export const INITIAL_COMMERCE_STATE: CommerceState = {
    isEnabled: false,
    activeProduct: null,
    saleStatus: 'IDLE',
    winners: [],
    revenue: 0,
    overlayVisible: false,
    queue: []
};

export const processAislesTransaction = (transcript: string, products: Product[], currentState: CommerceState): Partial<CommerceState> | null => {
    const text = transcript.toLowerCase();
    
    // Normalización robusta para SKUs
    const matchedProduct = products.find(p => 
        text.includes(p.sku.toLowerCase()) || 
        text.includes(p.name.toLowerCase()) ||
        (text.includes("lo quiero") && currentState.activeProduct?.sku === p.sku)
    );

    if (matchedProduct && matchedProduct.stock > 0) {
        const newWinner = { 
          userId: "User_" + Math.floor(Math.random()*1000), 
          timestamp: Date.now(), 
          sku: matchedProduct.sku,
          status: 'HELD' as const
        };
        return {
            winners: [...currentState.winners, newWinner],
            revenue: currentState.revenue + matchedProduct.price,
            activeProduct: { ...matchedProduct, stock: matchedProduct.stock - 1 }
        };
    }

    return null;
};
