import React from 'react';
import { X, Clock, MapPin, Phone, ShieldCheck, CreditCard, HelpCircle } from 'lucide-react';
import { StoreConfig } from '../types';

interface InfoLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
}

export const InfoLocationModal: React.FC<InfoLocationModalProps> = ({
  isOpen,
  onClose,
  config
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-stone-100 max-h-[88vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-[#b80c1d] flex items-center justify-center font-bold">
              🥟
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                Tentang {config.namaToko}
              </h3>
              <p className="text-[11px] text-stone-500 font-semibold text-[#b80c1d]">
                {config.tagline} · {config.slogan}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
            aria-label="Tutup info"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Jam Operasional & Lokasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <Clock className="w-4 h-4 text-[#b80c1d]" />
              <span>Jam Operasional</span>
            </div>
            <p className="text-stone-600">{config.jamOperasional}</p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Buka Setiap Hari
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <MapPin className="w-4 h-4 text-[#b80c1d]" />
              <span>Wilayah Layanan</span>
            </div>
            <p className="text-stone-600">{config.lokasiToko}</p>
            <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Pickup & Pengantaran
            </span>
          </div>
        </div>

        {/* 2. Cara Pemesanan */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-xs sm:text-sm">
            <HelpCircle className="w-4 h-4 text-[#b80c1d]" />
            <h4>Cara Mudah Memesan di DIMSUMANYU:</h4>
          </div>

          <ol className="space-y-2 text-xs text-stone-600 list-decimal list-inside pl-1">
            <li>
              <b>Pilih Menu:</b> Pilih varian dimsum favorit Anda (Original, Mentai, Goreng, atau Frozen) dan sesuaikan jumlah porsi.
            </li>
            <li>
              <b>Isi Data Pemesan:</b> Masukkan nama, nomor WhatsApp aktif, dan alamat pengantaran atau pilihan ambil di toko.
            </li>
            <li>
              <b>Pilih Metode Bayar:</b> Tersedia QRIS (Scan langsung all e-wallet & mobile banking), Transfer Allo Bank, atau COD / Tunai.
            </li>
            <li>
              <b>Kirim via WhatsApp:</b> Sistem akan mengarahkan rincian otomatis ke WhatsApp Admin agar pesanan Anda segera diproses!
            </li>
          </ol>
        </div>

        {/* 3. Informasi Pembayaran Resmi */}
        <div className="bg-[#fff5f5] rounded-2xl border border-[#ffe3e3] p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-xs sm:text-sm">
            <CreditCard className="w-4 h-4 text-[#b80c1d]" />
            <h4>Rekening Pembayaran Resmi:</h4>
          </div>

          <div className="text-xs text-stone-700 space-y-1">
            <p>• <b>Bank:</b> {config.bankName}</p>
            <p>• <b>Atas Nama:</b> {config.bankAccountName}</p>
            <p>• <b>Nomor Rekening:</b> <span className="font-mono font-bold text-[#b80c1d]">{config.bankAccountNumber}</span></p>
            <p>• <b>QRIS:</b> Scan barcode QRIS resmi DIMSUMANYU yang tersedia saat checkout.</p>
          </div>
        </div>

        {/* 4. Jaminan Kualitas */}
        <div className="border-t border-stone-200 pt-3 flex items-start gap-2.5 text-xs text-stone-500">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            Semua olahan dimsum kami diproduksi menggunakan daging berkualitas tinggi secara higienis, 100% Halal, tanpa bahan pengawet berbahaya, dan dijamin sensasi ngedaging di setiap gigitan!
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
        >
          Mengerti & Tutup
        </button>
      </div>
    </div>
  );
};
