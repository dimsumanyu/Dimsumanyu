import React from 'react';
import { StoreConfig } from '../types';

interface FooterProps {
  config: StoreConfig;
  onOpenInfo: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenInfo, onOpenAdmin }) => {
  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 py-10 mt-16 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🥟</span>
              <span className="font-extrabold text-white text-base tracking-tight">
                {config.namaToko}
              </span>
            </div>
            <p className="text-stone-300 font-semibold mb-1">{config.tagline}</p>
            <p className="text-stone-400 text-[11px] leading-relaxed max-w-sm">
              {config.slogan} Sajian dimsum kukus, mentai bakar, goreng krispi, dan kemasan frozen siap masak.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              Layanan & Operasional
            </h4>
            <p className="text-[11px] mb-1">
              <b>Jam Buka:</b> {config.jamOperasional}
            </p>
            <p className="text-[11px] mb-1">
              <b>Wilayah:</b> {config.lokasiToko}
            </p>
            <p className="text-[11px] text-stone-400">
              Menerima pesanan partai besar, arisan, catering box, dan reseller.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              Kontak Resmi
            </h4>
            <p className="text-[11px] mb-1">
              <b>WhatsApp:</b> +{config.adminWaNumber}
            </p>
            <p className="text-[11px] mb-3">
              <b>Rekening:</b> {config.bankName} a.n {config.bankAccountName}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenInfo}
                className="text-stone-300 hover:text-white underline text-[11px]"
              >
                Cara Pesan
              </button>
              <span className="text-stone-600">·</span>
              <button
                onClick={onOpenAdmin}
                className="text-stone-300 hover:text-white underline text-[11px]"
              >
                Mode Pengelola
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} {config.namaToko} · Semua Hak Cipta Dilindungi.</p>
          <p>Dibuat untuk kemudahan pemesanan cepat via WhatsApp & QRIS.</p>
        </div>
      </div>
    </footer>
  );
};
