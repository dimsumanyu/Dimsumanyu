import React, { useState } from 'react';
import {
  ArrowLeft,
  Receipt,
  User,
  Phone,
  MapPin,
  CreditCard,
  Copy,
  Check,
  MessageSquare,
  QrCode,
  Building,
  Banknote,
  Send
} from 'lucide-react';
import { CartItem, MetodePembayaran, OpsiPengiriman, OrderRecord, StoreConfig } from '../types';
import { formatRupiah, generateInvoiceCode } from '../utils/formatters';

interface CheckoutStep2Props {
  config: StoreConfig;
  cart: Record<string, CartItem>;
  onBackToMenu: () => void;
  onSubmitOrder: (order: OrderRecord) => void;
  isSubmitting: boolean;
}

export const CheckoutStep2: React.FC<CheckoutStep2Props> = ({
  config,
  cart,
  onBackToMenu,
  onSubmitOrder,
  isSubmitting
}) => {
  const [nama, setNama] = useState('');
  const [phone, setPhone] = useState('');
  const [alamat, setAlamat] = useState('');
  const [metodePengiriman, setMetodePengiriman] = useState<OpsiPengiriman>('DIANTAR');
  const [metodeBayar, setMetodeBayar] = useState<MetodePembayaran>('QRIS');
  const [catatan, setCatatan] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cartList = Object.values(cart);
  const totalAmount = cartList.reduce((sum, item) => sum + item.menu.harga * item.qty, 0);
  const totalItemsCount = cartList.reduce((sum, item) => sum + item.qty, 0);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(config.bankAccountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartList.length === 0) {
      setErrorMessage('Keranjang belanja kosong! Silakan pilih menu terlebih dahulu.');
      return;
    }

    if (!nama.trim() || !phone.trim() || !alamat.trim()) {
      setErrorMessage('Harap lengkapi semua kolom yang bertanda bintang (*)');
      return;
    }

    const orderRecord: OrderRecord = {
      id: 'ord-' + Date.now(),
      invoiceNumber: generateInvoiceCode(),
      tanggal: new Date().toISOString(),
      nama: nama.trim(),
      phone: phone.trim(),
      alamat: alamat.trim(),
      metodePengiriman,
      metodeBayar,
      catatan: catatan.trim(),
      items: cartList.map((c) => ({
        id: c.menu.id,
        nama: c.menu.nama,
        qty: c.qty,
        harga: c.menu.harga,
        subtotal: c.menu.harga * c.qty
      })),
      totalHarga: totalAmount,
      status: 'Baru'
    };

    onSubmitOrder(orderRecord);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#b80c1d] transition-colors py-1 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali Pilih Menu Dimsum</span>
        </button>
      </div>

      {/* Top Warning if cart empty */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {errorMessage}
        </div>
      )}

      {/* Section 1: Order Summary Box */}
      <section className="bg-[#fff5f5] rounded-3xl border border-[#ffe3e3] p-5 shadow-xs space-y-3">
        <div className="flex justify-between items-center border-b border-[#ffe3e3] pb-3">
          <div className="flex items-center gap-2 text-stone-900 font-extrabold text-sm">
            <Receipt className="w-4 h-4 text-[#b80c1d]" />
            <h3>Ringkasan Pesanan</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-[#b80c1d] text-white px-2.5 py-0.5 rounded-full">
            {totalItemsCount} Item
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-2 text-xs text-stone-700">
          {cartList.map((cartItem) => {
            const subtotal = cartItem.menu.harga * cartItem.qty;
            return (
              <div
                key={cartItem.menu.id}
                className="flex justify-between items-center border-b border-[#ffe3e3]/60 pb-1.5 last:border-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400">•</span>
                  <span className="font-medium text-stone-800">{cartItem.menu.nama}</span>
                  <span className="font-extrabold text-[#b80c1d] font-mono tabular-nums">
                    ({cartItem.qty}x)
                  </span>
                </div>
                <span className="font-extrabold text-stone-900 font-mono tabular-nums">
                  {formatRupiah(subtotal)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Total Row */}
        <div className="border-t border-[#ffe3e3] pt-3 flex justify-between items-center font-extrabold text-stone-900 text-sm sm:text-base">
          <span>Total Pembayaran:</span>
          <span className="text-[#b80c1d] font-mono tabular-nums text-lg">
            {formatRupiah(totalAmount)}
          </span>
        </div>
      </section>

      {/* Section 2: Customer Data & Payment Form */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <User className="w-4 h-4 text-[#b80c1d]" />
          <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
            Data Pemesan & Pengiriman
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Nama Lengkap <span className="text-[#b80c1d]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#b80c1d] focus:bg-white text-xs sm:text-sm text-stone-900 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              No. WhatsApp Aktif <span className="text-[#b80c1d]">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789 atau 628..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#b80c1d] focus:bg-white text-xs sm:text-sm text-stone-900 focus:outline-none transition"
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              Konfirmasi status pesanan dan rincian akan dikirimkan ke nomor ini.
            </p>
          </div>

          {/* Opsi Pengiriman */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Opsi Pemesanan <span className="text-[#b80c1d]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMetodePengiriman('DIANTAR');
                  if (alamat === 'Ambil di Toko / Outlet Dimsum Anyu') setAlamat('');
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  metodePengiriman === 'DIANTAR'
                    ? 'border-[#b80c1d] bg-red-50/50 text-[#b80c1d]'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    metodePengiriman === 'DIANTAR'
                      ? 'border-[#b80c1d] bg-[#b80c1d]'
                      : 'border-stone-300'
                  }`}
                >
                  {metodePengiriman === 'DIANTAR' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs block">Diantar ke Alamat</span>
                  <span className="text-[10px] text-stone-500">Kurir / Ojek Online</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMetodePengiriman('AMBIL_SENDIRI');
                  setAlamat('Ambil di Toko / Outlet Dimsum Anyu');
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  metodePengiriman === 'AMBIL_SENDIRI'
                    ? 'border-[#b80c1d] bg-red-50/50 text-[#b80c1d]'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    metodePengiriman === 'AMBIL_SENDIRI'
                      ? 'border-[#b80c1d] bg-[#b80c1d]'
                      : 'border-stone-300'
                  }`}
                >
                  {metodePengiriman === 'AMBIL_SENDIRI' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs block">Ambil di Outlet</span>
                  <span className="text-[10px] text-stone-500">Self Pickup</span>
                </div>
              </button>
            </div>
          </div>

          {/* Alamat / Lokasi Pengambilan */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Alamat Lengkap / Titik Pengantaran <span className="text-[#b80c1d]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
              <textarea
                rows={2}
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Alamat lengkap (nama jalan, nomor rumah, patokan) atau 'Ambil di Toko'"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#b80c1d] focus:bg-white text-xs sm:text-sm text-stone-900 focus:outline-none transition resize-none"
              />
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Metode Pembayaran <span className="text-[#b80c1d]">*</span>
            </label>
            <div className="space-y-2">
              {/* Option 1: QRIS */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  metodeBayar === 'QRIS'
                    ? 'border-[#b80c1d] bg-red-50/40 text-stone-900'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="QRIS"
                  checked={metodeBayar === 'QRIS'}
                  onChange={() => setMetodeBayar('QRIS')}
                  className="accent-[#b80c1d]"
                />
                <div className="w-8 h-8 rounded-lg bg-red-100 text-[#b80c1d] flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs flex items-center gap-2">
                    <span>QRIS (Scan Barcode All E-Wallet & Mobile Banking)</span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Instan
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, Dana, LinkAja, dll.
                  </p>
                </div>
              </label>

              {/* Option 2: Transfer Bank */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  metodeBayar === 'Transfer Bank'
                    ? 'border-[#b80c1d] bg-red-50/40 text-stone-900'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Transfer Bank"
                  checked={metodeBayar === 'Transfer Bank'}
                  onChange={() => setMetodeBayar('Transfer Bank')}
                  className="accent-[#b80c1d]"
                />
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs">
                    Transfer Bank ({config.bankName})
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Transfer ke rekening resmi {config.bankName} a.n {config.bankAccountName}
                  </p>
                </div>
              </label>

              {/* Option 3: Tunai COD */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  metodeBayar === 'Tunai (COD / Ambil di Tempat)'
                    ? 'border-[#b80c1d] bg-red-50/40 text-stone-900'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Tunai (COD / Ambil di Tempat)"
                  checked={metodeBayar === 'Tunai (COD / Ambil di Tempat)'}
                  onChange={() => setMetodeBayar('Tunai (COD / Ambil di Tempat)')}
                  className="accent-[#b80c1d]"
                />
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs">
                    Tunai (COD / Ambil di Tempat)
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Bayar langsung tunai saat pesanan diterima atau saat ambil di outlet
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Bank Info Box (visible when Transfer Bank is selected) */}
          {metodeBayar === 'Transfer Bank' && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-stone-900">{config.bankName}</p>
                  <p className="text-[11px] text-stone-600">
                    a.n <span className="font-bold text-stone-900">{config.bankAccountName}</span>
                  </p>
                  <p className="text-sm font-mono font-bold text-[#b80c1d] tracking-wider mt-1">
                    {config.bankAccountNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="bg-[#b80c1d] hover:bg-[#8b0000] text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition"
                >
                  {copiedBank ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Rekening</span>
                    </>
                  )}
                </button>
              </div>

              {copiedBank && (
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Nomor rekening berhasil disalin ke clipboard!</span>
                </p>
              )}
            </div>
          )}

          {/* Catatan Tambahan (Opsional) */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Catatan Pesanan (Opsional)
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Sambal dipisah, minta sumpit ekstra, dikirim jam 12 siang"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#b80c1d] focus:bg-white text-xs sm:text-sm text-stone-900 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Submit Order Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || cartList.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2.5 text-xs sm:text-sm uppercase tracking-wider active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Pesanan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesanan via WhatsApp</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              Pesanan Anda akan langsung diteruskan ke WhatsApp Admin DIMSUMANYU ({config.adminWaNumber}).
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};
