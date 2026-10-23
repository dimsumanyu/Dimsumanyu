import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, qty: number, itemNote?: string) => void;
  currentCartQty: number;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  currentCartQty
}) => {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);

  if (!isOpen || !item) return null;

  const isAvailable = item.status === 'TERSEDIA';
  const isBestSeller = item.keterangan?.includes('BEST SELLER');

  const handleAdd = () => {
    onAddToCart(item, qty, note);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-stone-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition backdrop-blur-xs"
          aria-label="Tutup detail menu"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Image Header */}
        <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
          <img
            src={item.gambar}
            alt={item.nama}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {isBestSeller && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                <span>BEST SELLER</span>
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isAvailable ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isAvailable ? 'Tersedia' : 'Habis'}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>{item.kategori}</span>
              <span aria-hidden="true">·</span>
              <span>{item.porsi}</span>
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 leading-tight">
              {item.nama}
            </h2>
            <p className="text-lg font-bold text-[#b80c1d] font-mono tabular-nums mt-1">
              {formatRupiah(item.harga)}
            </p>
          </div>

          <div className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
            <h4 className="font-bold text-stone-900 mb-1">Deskripsi Menu:</h4>
            <p>{item.deskripsi}</p>
          </div>

          {/* Special notes for this item */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Catatan Khusus Menu Ini (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Sambal dipisah, kukus matang sempurna"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#b80c1d] focus:outline-none transition"
            />
          </div>

          {/* Current cart indicator if already added */}
          {currentCartQty > 0 && (
            <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
              <span>Sudah ada di keranjang:</span>
              <b className="text-stone-900 font-mono">{currentCartQty} porsi</b>
            </div>
          )}
        </div>

        {/* Footer with Qty & Add Button */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              disabled={qty <= 1}
              className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
              aria-label="Kurang satu"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center font-bold text-xs font-mono tabular-nums text-stone-900">
              {qty}
            </span>
            <button
              onClick={() => setQty((prev) => prev + 1)}
              className="w-8 h-8 rounded-lg bg-[#b80c1d] hover:bg-[#8b0000] text-white flex items-center justify-center font-bold text-xs"
              aria-label="Tambah satu"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className="flex-1 py-3 px-4 bg-[#b80c1d] hover:bg-[#8b0000] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Berhasil Ditambahkan!</span>
              </>
            ) : (
              <>
                <span>Tambah ke Keranjang</span>
                <span className="font-mono tabular-nums font-semibold">
                  ({formatRupiah(item.harga * qty)})
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
