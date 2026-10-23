import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Copy, Check, ArrowRight, Printer } from 'lucide-react';
import { OrderRecord, StoreConfig } from '../types';
import { formatRupiah, generateWhatsAppLink, buildWhatsAppMessage } from '../utils/formatters';

interface OrderSuccessModalProps {
  order: OrderRecord | null;
  config: StoreConfig;
  isOpen: boolean;
  onClose: () => void;
  onStartNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  config,
  isOpen,
  onClose,
  onStartNewOrder
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const waLink = generateWhatsAppLink(config, order);

  const handleCopyText = () => {
    const text = buildWhatsAppMessage(config, order);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100 max-h-[92vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900">
            Pesanan Berhasil Dikirim!
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Rincian pesanan telah disiapkan dan siap diproses oleh tim DIMSUMANYU.
          </p>
        </div>

        {/* Invoice Receipt Slip */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-stone-200 pb-2">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-semibold">No. Invoice</span>
              <p className="font-mono font-bold text-stone-900">{order.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Metode Bayar</span>
              <p className="font-bold text-stone-900">{order.metodeBayar}</p>
            </div>
          </div>

          <div className="space-y-1 text-stone-600 text-[11px]">
            <p><b>Pemesan:</b> {order.nama} ({order.phone})</p>
            <p><b>Pengiriman:</b> {order.alamat}</p>
            {order.catatan && <p><b>Catatan:</b> {order.catatan}</p>}
          </div>

          {/* Items */}
          <div className="border-t border-stone-200 pt-2 space-y-1.5">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Rincian Menu:</div>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-stone-800">
                <span>
                  • {item.nama} <b className="text-[#b80c1d] font-mono">({item.qty}x)</b>
                </span>
                <span className="font-mono tabular-nums font-semibold">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-2 flex justify-between items-center font-extrabold text-sm text-stone-900">
            <span>Total Tagihan:</span>
            <span className="text-base text-[#b80c1d] font-mono tabular-nums">
              {formatRupiah(order.totalHarga)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Buka Chat WhatsApp Admin</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyText}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks WA</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Bukti</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartNewOrder();
            }}
            className="w-full py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition flex items-center justify-center gap-1 mt-2"
          >
            <span>Kembali ke Halaman Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
