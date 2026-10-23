import React from 'react';
import { X, History, ShoppingBag, ArrowRight } from 'lucide-react';
import { OrderRecord } from '../types';
import { formatRupiah } from '../utils/formatters';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onReorder: (order: OrderRecord) => void;
  onViewOrder: (order: OrderRecord) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
  onViewOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-stone-100 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                Riwayat Pesanan Anda
              </h3>
              <p className="text-[11px] text-stone-500">
                Daftar transaksi tersimpan di perangkat ini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
            aria-label="Tutup riwayat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 mb-2 text-stone-300" />
              <p className="font-bold text-stone-700 text-sm">Belum Ada Riwayat Pesanan</p>
              <p className="text-xs text-stone-500 mt-1">
                Pesanan yang Anda buat akan tercatat di sini secara otomatis.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2 hover:border-stone-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-900 block">
                      {ord.invoiceNumber}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(ord.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {ord.metodeBayar}
                  </span>
                </div>

                {/* Items summary */}
                <div className="text-xs text-stone-600 py-1 border-y border-stone-200/60">
                  <p className="font-medium truncate">
                    {ord.items.map((i) => `${i.nama} (${i.qty}x)`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Total</span>
                    <span className="font-extrabold text-[#b80c1d] text-sm font-mono tabular-nums">
                      {formatRupiah(ord.totalHarga)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewOrder(ord)}
                      className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold transition"
                    >
                      Lihat Rincian
                    </button>
                    <button
                      onClick={() => {
                        onReorder(ord);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#b80c1d] hover:bg-[#8b0000] text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Pesan Lagi</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
