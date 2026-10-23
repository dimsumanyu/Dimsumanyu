import React from 'react';
import { ShoppingBag, History, Info, ShieldCheck, ArrowLeft } from 'lucide-react';
import { StoreConfig } from '../types';

interface HeaderProps {
  config: StoreConfig;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  cartCount: number;
  cartTotal: number;
  openCartDrawer: () => void;
  openHistoryModal: () => void;
  openInfoModal: () => void;
  openAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  step,
  setStep,
  cartCount,
  openCartDrawer,
  openHistoryModal,
  openInfoModal,
  openAdminModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-1.5 -ml-1 text-stone-600 hover:text-red-700 hover:bg-stone-100 rounded-lg transition-colors"
                title="Kembali ke Menu"
                aria-label="Kembali ke Menu"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setStep(1)}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#b80c1d] text-white flex items-center justify-center font-black text-base shadow-sm">
                🥟
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-stone-900 group-hover:text-[#b80c1d] transition-colors whitespace-nowrap shrink-0 block leading-tight">
                  {config.namaToko}
                </span>
                <span className="text-[11px] font-semibold text-[#b80c1d] tracking-wide block">
                  {config.tagline}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setStep(1)}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
                step === 1 ? 'text-[#b80c1d] font-bold' : ''
              }`}
            >
              Daftar Menu
            </button>
            <button
              onClick={openInfoModal}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <Info className="w-4 h-4" />
              <span>Cara Pesan & Info</span>
            </button>
            <button
              onClick={openHistoryModal}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <History className="w-4 h-4" />
              <span>Riwayat Pesanan</span>
            </button>
            <button
              onClick={openAdminModal}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kelola Toko</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action (Keranjang / Checkout) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openCartDrawer}
              className="relative px-3.5 py-2 text-xs font-semibold text-white bg-[#b80c1d] hover:bg-[#8b0000] rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#b80c1d] font-mono font-bold text-[11px] px-1.5 py-0.2 rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Step Indicator Sub-Bar */}
      <div className="bg-stone-50/80 border-t border-stone-200/60 px-4 py-1.5 flex items-center justify-between text-xs text-stone-600">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px]">
            <span className={step === 1 ? 'font-bold text-[#b80c1d]' : 'text-stone-500'}>
              1. Pilih Dimsum
            </span>
            <span className="text-stone-300">/</span>
            <span className={step === 2 ? 'font-bold text-[#b80c1d]' : 'text-stone-500'}>
              2. Data & Pembayaran
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={openHistoryModal}
              className="md:hidden flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium"
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat</span>
            </button>
            <button
              onClick={openInfoModal}
              className="md:hidden flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Info</span>
            </button>
            <span className="font-mono tabular-nums text-stone-500">
              Langkah {step} dari 2
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
