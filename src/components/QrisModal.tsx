import React, { useState } from 'react';
import { X, Download, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { IMAGES } from '../data/initialData';
import { formatRupiah } from '../utils/formatters';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  invoiceNumber: string;
  onConfirmAndOpenWA: () => void;
}

export const QrisModal: React.FC<QrisModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  invoiceNumber,
  onConfirmAndOpenWA
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [imgSrc, setImgSrc] = useState(IMAGES.qrisLocal);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = `QRIS_DIMSUMANYU_${invoiceNumber}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      // Fallback: trigger download via link attribute or direct image URL
      const a = document.createElement('a');
      a.href = imgSrc;
      a.download = `QRIS_DIMSUMANYU_${invoiceNumber}.jpg`;
      a.target = '_blank';
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-5 text-center space-y-4 shadow-2xl relative border border-stone-100 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm transition"
          aria-label="Tutup popup QRIS"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="bg-red-50 text-[#b80c1d] border border-red-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
            Pembayaran QRIS
          </span>
          <h3 className="text-base font-extrabold text-stone-900">
            Scan QRIS DIMSUMANYU
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Scan langsung dengan BCA Mobile, GoPay, OVO, ShopeePay, Dana, atau simpan ke galeri HP
          </p>
        </div>

        {/* QRIS Image Container */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-2.5 flex flex-col items-center justify-center space-y-2">
          <div className="w-full bg-white rounded-xl p-1 shadow-2xs overflow-hidden flex items-center justify-center min-h-[220px]">
            <img
              src={imgSrc}
              alt="QRIS DIMSUMANYU"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={() => {
                if (imgSrc !== IMAGES.qrisRemoteFallback) {
                  setImgSrc(IMAGES.qrisRemoteFallback);
                }
              }}
              className="w-full max-h-72 object-contain rounded-lg"
            />
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gambar Tersimpan ke Galeri</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Simpan Gambar QRIS ke Galeri</span>
              </>
            )}
          </button>
        </div>

        {/* Payment Amount & Step Guidance */}
        <div className="space-y-3">
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              Total Tagihan Pembayaran:
            </span>
            <span className="text-xl font-black text-[#b80c1d] font-mono tabular-nums">
              {formatRupiah(totalAmount)}
            </span>
            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
              Ref Invoice: {invoiceNumber}
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-left text-[10px] text-stone-500 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Setelah pembayaran berhasil, tekan tombol di bawah untuk mengirim konfirmasi dan bukti bayar ke WhatsApp Admin.
            </span>
          </div>

          <button
            onClick={onConfirmAndOpenWA}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-3 rounded-xl shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Selesai Bayar & Buka WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
