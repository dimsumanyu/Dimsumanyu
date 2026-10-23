import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem, MenuItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, CartItem>;
  onUpdateQty: (item: MenuItem, change: number) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onClearCart,
  onProceedCheckout
}) => {
  if (!isOpen) return null;

  const cartList = Object.values(cart);
  const totalAmount = cartList.reduce((sum, item) => sum + item.menu.harga * item.qty, 0);
  const totalItemsCount = cartList.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-[#b80c1d] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-sm">
                  Keranjang Pesanan
                </h3>
                <span className="text-[11px] text-stone-500 font-mono tabular-nums">
                  {totalItemsCount} porsi dipilih
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartList.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg text-xs flex items-center gap-1 transition"
                  title="Kosongkan keranjang"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-[11px]">Kosongkan</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
                aria-label="Tutup keranjang"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-2xl mb-3">
                  🥟
                </div>
                <h4 className="font-bold text-stone-700 text-sm mb-1">
                  Keranjang Anda Masih Kosong
                </h4>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Pilih dimsum lezat favorit Anda dari katalog untuk memulai pemesanan.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Lihat Menu Dimsum
                </button>
              </div>
            ) : (
              cartList.map((cartItem) => {
                const subtotal = cartItem.menu.harga * cartItem.qty;
                return (
                  <div
                    key={cartItem.menu.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3 justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[10px] text-stone-500 mb-0.5">
                        <span>{cartItem.menu.kategori}</span>
                        <span aria-hidden="true">·</span>
                        <span>{cartItem.menu.porsi}</span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-xs truncate">
                        {cartItem.menu.nama}
                      </h4>
                      <div className="text-xs font-semibold text-[#b80c1d] font-mono tabular-nums mt-0.5">
                        {formatRupiah(cartItem.menu.harga)}
                      </div>
                      {cartItem.catatanItem && (
                        <p className="text-[10px] text-stone-500 italic mt-1 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block">
                          Note: {cartItem.catatanItem}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-extrabold text-xs text-stone-900 font-mono tabular-nums">
                        {formatRupiah(subtotal)}
                      </span>

                      {/* Qty Buttons */}
                      <div className="flex items-center bg-white rounded-xl border border-stone-200 p-0.5">
                        <button
                          onClick={() => onUpdateQty(cartItem.menu, -1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs"
                          aria-label="Kurangi porsi"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs font-mono tabular-nums text-stone-900">
                          {cartItem.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(cartItem.menu, 1)}
                          className="w-6 h-6 rounded-lg bg-[#b80c1d] hover:bg-[#8b0000] text-white flex items-center justify-center font-bold text-xs"
                          aria-label="Tambah porsi"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartList.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-stone-50/80 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal Menu:</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-800">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Total Porsi:</span>
                  <span className="font-mono tabular-nums">{totalItemsCount} item</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center font-black text-sm text-stone-900">
                  <span>Total Tagihan:</span>
                  <span className="text-base text-[#b80c1d] font-mono tabular-nums">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full py-3 px-4 bg-[#b80c1d] hover:bg-[#8b0000] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Lanjut ke Pengisian Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
