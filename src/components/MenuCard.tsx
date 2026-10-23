import React, { useState } from 'react';
import { Plus, Minus, Flame, Eye } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface MenuCardProps {
  item: MenuItem;
  cartQty: number;
  onUpdateQty: (item: MenuItem, change: number) => void;
  onOpenDetail: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  cartQty,
  onUpdateQty,
  onOpenDetail
}) => {
  const [imgError, setImgError] = useState(false);
  const isAvailable = item.status === 'TERSEDIA';
  const isBestSeller = item.keterangan?.includes('BEST SELLER');

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-stone-300">
      {/* Top Image & Badge Section */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(item)}>
        {!imgError && item.gambar ? (
          <img
            src={item.gambar}
            alt={item.nama}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-50 to-stone-100 text-stone-400">
            <span className="text-3xl mb-1">🥟</span>
            <span className="text-[10px] font-medium text-stone-500">{item.kategori}</span>
          </div>
        )}

        {/* Best Seller Ribbon */}
        {isBestSeller && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" />
            <span>BEST SELLER</span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(item);
          }}
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-stone-900/75 hover:bg-stone-950 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center gap-1"
          aria-label={`Lihat detail ${item.nama}`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="text-[10px] pr-0.5">Detail</span>
        </button>
      </div>

      {/* Body Information */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Status - Unboxed metadata (Zero-Pill discipline) */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{item.kategori}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-400">{item.porsi}</span>
            </div>

            <span
              className={`font-semibold ${
                isAvailable ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isAvailable ? 'Tersedia' : 'Habis'}
            </span>
          </div>

          <h3
            onClick={() => onOpenDetail(item)}
            className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 hover:text-[#b80c1d] transition-colors cursor-pointer mb-1"
          >
            {item.nama}
          </h3>

          <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {item.deskripsi}
          </p>
        </div>

        {/* Footer: Price & Qty Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Harga</span>
            <span className="font-extrabold text-sm sm:text-base text-[#b80c1d] font-mono tabular-nums">
              {formatRupiah(item.harga)}
            </span>
          </div>

          <div className="shrink-0">
            {!isAvailable ? (
              <span className="text-xs text-stone-400 italic font-medium px-2 py-1">
                Stok Habis
              </span>
            ) : cartQty === 0 ? (
              <button
                onClick={() => onUpdateQty(item, 1)}
                className="px-3.5 py-1.5 bg-[#b80c1d] hover:bg-[#8b0000] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            ) : (
              <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
                <button
                  onClick={() => onUpdateQty(item, -1)}
                  className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:bg-stone-50 flex items-center justify-center font-bold text-xs shadow-2xs active:scale-90 transition"
                  aria-label="Kurangi porsi"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-bold text-xs text-stone-900 font-mono tabular-nums">
                  {cartQty}
                </span>
                <button
                  onClick={() => onUpdateQty(item, 1)}
                  className="w-7 h-7 rounded-lg bg-[#b80c1d] text-white hover:bg-[#8b0000] flex items-center justify-center font-bold text-xs shadow-2xs active:scale-90 transition"
                  aria-label="Tambah porsi"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
