import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface StickyBottomBarProps {
  totalAmount: number;
  totalItems: number;
  onProceedOrder: () => void;
  onOpenCart: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  totalAmount,
  totalItems,
  onProceedOrder,
  onOpenCart
}) => {
  const hasItems = totalItems > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-30 px-4 py-3 shadow-2xl transition-all duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <button
          onClick={onOpenCart}
          className="text-left flex items-center gap-3 focus:outline-none group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-red-50 text-stone-700 group-hover:text-[#b80c1d] flex items-center justify-center transition">
            <ShoppingBag className="w-5 h-5" />
            {hasItems && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#b80c1d] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <div>
            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">
              Total Pesanan:
            </span>
            <span className="font-extrabold text-[#b80c1d] text-base sm:text-lg leading-tight font-mono tabular-nums block">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </button>

        <button
          onClick={onProceedOrder}
          disabled={!hasItems}
          className={`px-6 sm:px-8 py-3 rounded-2xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-md ${
            hasItems
              ? 'bg-[#b80c1d] hover:bg-[#8b0000] text-white shadow-red-950/20 cursor-pointer animate-pulse'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>ORDER SEKARANG</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
