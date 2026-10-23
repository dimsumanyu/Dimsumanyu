import React from 'react';
import { IMAGES } from '../data/initialData';
import { StoreConfig } from '../types';

interface HeroBannerProps {
  config: StoreConfig;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ config, onExploreClick }) => {
  return (
    <section className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl mb-8">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.heroBanner}
          alt="DIMSUMANYU Bamboo Steamer Dimsum"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 transform transition-transform duration-700"
        />
        {/* Measured dark scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/30" />
      </div>

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-2xl">
        {/* Unboxed editorial kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold text-red-300 mb-3 tracking-wide uppercase">
          <span>{config.namaToko}</span>
          <span aria-hidden="true">·</span>
          <span>{config.tagline}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-300">Buka Setiap Hari</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance mb-4">
          Dimsum Daging Padat & Juicy Berlimpah.
        </h1>

        <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl mb-6">
          Nikmati sensasi ngedaging asli dari olahan daging ayam dan udang pilihan. Disajikan hangat dengan saus mentai bakar torched dan racikan chili oil pedas gurih khas Anyu.
        </p>

        {/* Feature Highlights - Unboxed metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-300 mb-8 border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-red-400 font-bold">✓</span>
            <span>Daging Padat & Bertekstur</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-red-400 font-bold">✓</span>
            <span>100% Halal & Tanpa Pengawet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-red-400 font-bold">✓</span>
            <span>Siap Santap & Frozen Box</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreClick}
            className="px-6 py-3 bg-[#b80c1d] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-950/40 active:scale-95"
          >
            Pilih Menu Sekarang
          </button>
          <div className="text-xs text-stone-300">
            <span className="block font-semibold">Pengiriman Cepat</span>
            <span className="text-stone-400 text-[11px]">{config.lokasiToko}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
