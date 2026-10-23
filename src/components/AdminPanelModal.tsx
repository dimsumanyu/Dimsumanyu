import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Settings,
  Utensils,
  ListOrdered,
  Plus,
  Save,
  RotateCcw,
  Check,
  Trash2,
  ExternalLink,
  MessageCircle,
  Download
} from 'lucide-react';
import { MenuItem, OrderRecord, StoreConfig } from '../types';
import { formatRupiah } from '../utils/formatters';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  onUpdateConfig: (newConfig: StoreConfig) => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  onResetMenu: () => void;
  onReloadFromDB?: () => Promise<void> | void;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  onClearOrders: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  menuItems,
  onUpdateMenuItems,
  onResetMenu,
  onReloadFromDB,
  orders,
  onUpdateOrderStatus,
  onClearOrders
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'menu' | 'orders'>('settings');
  const [formConfig, setFormConfig] = useState<StoreConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Menu Item Form
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [newMenu, setNewMenu] = useState<Partial<MenuItem>>({
    nama: '',
    kategori: 'Dimsum Kukus',
    harga: 15000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '',
    porsi: 'Isi 4 pcs + Saus Merah',
    gambar: ''
  });

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleItemStatus = (id: string) => {
    const updated = menuItems.map((item) =>
      item.id === id
        ? {
            ...item,
            status: (item.status === 'TERSEDIA' ? 'HABIS' : 'TERSEDIA') as 'TERSEDIA' | 'HABIS'
          }
        : item
    );
    onUpdateMenuItems(updated);
  };

  const handleToggleBestSeller = (id: string) => {
    const updated = menuItems.map((item) =>
      item.id === id
        ? {
            ...item,
            keterangan: item.keterangan?.includes('BEST SELLER') ? '' : 'BEST SELLER'
          }
        : item
    );
    onUpdateMenuItems(updated);
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, harga: newPrice } : item
    );
    onUpdateMenuItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Yakin ingin menghapus menu ini dari katalog?')) {
      onUpdateMenuItems(menuItems.filter((i) => i.id !== id));
    }
  };

  const handleAddNewMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenu.nama?.trim()) return;

    const item: MenuItem = {
      id: 'dm-' + Date.now(),
      nama: newMenu.nama.trim(),
      kategori: newMenu.kategori || 'Dimsum Kukus',
      harga: Number(newMenu.harga) || 15000,
      status: (newMenu.status as 'TERSEDIA' | 'HABIS') || 'TERSEDIA',
      keterangan: newMenu.keterangan || '',
      deskripsi: newMenu.deskripsi || 'Olahan dimsum daging lezat pilihan khas Anyu.',
      porsi: newMenu.porsi || 'Isi 4 pcs',
      gambar: newMenu.gambar || '/src/assets/images/dimsum_ayam_original_1792724120574.jpg'
    };

    onUpdateMenuItems([item, ...menuItems]);
    setIsAddingMenu(false);
    setNewMenu({
      nama: '',
      kategori: 'Dimsum Kukus',
      harga: 15000,
      status: 'TERSEDIA',
      keterangan: '',
      deskripsi: '',
      porsi: 'Isi 4 pcs + Saus Merah',
      gambar: ''
    });
  };

  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState('');

  const handleBulkImport = () => {
    setBulkError('');
    if (!bulkText.trim()) return;

    try {
      const lines = bulkText.trim().split('\n');
      const parsedItems: MenuItem[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Try comma, tab, or pipe delimiter
        let parts = line.split('\t');
        if (parts.length < 2) parts = line.split(',');
        if (parts.length < 2) parts = line.split('|');

        if (parts.length >= 2) {
          const nama = parts[0].trim().replace(/^["']|["']$/g, '');
          let kategori = 'Dimsum Kukus';
          let harga = 15000;
          let keterangan = '';
          let porsi = 'Isi 4 pcs';

          if (parts.length >= 3) {
            // format: nama, kategori, harga, keterangan, porsi
            kategori = parts[1].trim().replace(/^["']|["']$/g, '');
            const rawHarga = parts[2].replace(/[^\d]/g, '');
            harga = parseInt(rawHarga, 10) || 15000;
            keterangan = parts[3]?.trim().replace(/^["']|["']$/g, '') || '';
            porsi = parts[4]?.trim().replace(/^["']|["']$/g, '') || 'Isi 4 pcs';
          } else {
            // format: nama, harga
            const rawHarga = parts[1].replace(/[^\d]/g, '');
            harga = parseInt(rawHarga, 10) || 15000;
          }

          if (nama) {
            parsedItems.push({
              id: 'dm-' + (Date.now() + i),
              nama,
              kategori: kategori || 'Dimsum Kukus',
              harga,
              status: 'TERSEDIA',
              keterangan,
              deskripsi: `${nama} olahan daging lezat padat khas Anyu.`,
              porsi: porsi || 'Isi 4 pcs',
              gambar: '/src/assets/images/dimsum_ayam_original_1792724120574.jpg'
            });
          }
        }
      }

      if (parsedItems.length === 0) {
        setBulkError('Format teks belum sesuai. Contoh baris: Nama Menu, Kategori, Harga (e.g. Dimsum Udang, Dimsum Kukus, 18000)');
        return;
      }

      onUpdateMenuItems(parsedItems);
      setIsBulkImportOpen(false);
      setBulkText('');
      alert(`Berhasil mengimpor ${parsedItems.length} menu dari data yang Anda tempel!`);
    } catch {
      setBulkError('Gagal memproses data. Pastikan format teks benar.');
    }
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Invoice', 'Tanggal', 'Nama', 'WhatsApp', 'Alamat', 'Metode Bayar', 'Total Harga', 'Status'];
    const rows = orders.map((o) => [
      o.invoiceNumber,
      o.tanggal,
      `"${o.nama}"`,
      `"${o.phone}"`,
      `"${o.alamat.replace(/"/g, '""')}"`,
      o.metodeBayar,
      o.totalHarga,
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pesanan_dimsumanyu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative border border-stone-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <span>Panel Pengelola {config.namaToko}</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Atur nomor WhatsApp, rekening bank, katalog stok menu, dan riwayat pesanan masuk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
            aria-label="Tutup panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#b80c1d] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Info Toko & WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'menu'
                ? 'bg-[#b80c1d] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Katalog Menu ({menuItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#b80c1d] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Pesanan Masuk ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Info Toko & WhatsApp */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveConfig} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan berhasil disimpan!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Nama Brand Toko
                </label>
                <input
                  type="text"
                  value={formConfig.namaToko}
                  onChange={(e) => setFormConfig({ ...formConfig, namaToko: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:border-[#b80c1d] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Tagline Brand
                </label>
                <input
                  type="text"
                  value={formConfig.tagline}
                  onChange={(e) => setFormConfig({ ...formConfig, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:border-[#b80c1d] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="bg-red-50/60 p-3.5 rounded-2xl border border-red-200/60 space-y-3">
              <h4 className="font-bold text-[#b80c1d] text-xs flex items-center gap-1.5">
                <span>Nomor WhatsApp Tujuan Pesanan</span>
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Nomor WhatsApp Admin (Awali dengan 62)
                </label>
                <input
                  type="text"
                  value={formConfig.adminWaNumber}
                  onChange={(e) => setFormConfig({ ...formConfig, adminWaNumber: e.target.value })}
                  placeholder="Contoh: 6285754623156"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 font-mono font-bold focus:border-[#b80c1d] focus:outline-none transition"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Format: 6285754623156 (Pesanan customer otomatis dialihkan ke nomor WhatsApp ini saat klik kirim)
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-800 text-xs">Informasi Rekening Pembayaran</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    value={formConfig.bankName}
                    onChange={(e) => setFormConfig({ ...formConfig, bankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={formConfig.bankAccountNumber}
                    onChange={(e) => setFormConfig({ ...formConfig, bankAccountNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 font-mono font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Atas Nama Rekening
                  </label>
                  <input
                    type="text"
                    value={formConfig.bankAccountName}
                    onChange={(e) => setFormConfig({ ...formConfig, bankAccountName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-800 text-xs flex items-center justify-between">
                <span>Integrasi Google Apps Script (Webhook)</span>
                <a
                  href={formConfig.appScriptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Buka Endpoint</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </h4>
              <input
                type="url"
                value={formConfig.appScriptUrl}
                onChange={(e) => setFormConfig({ ...formConfig, appScriptUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-[11px] font-mono"
              />
              <p className="text-[10px] text-stone-500">
                URL Apps Script Google Sheets untuk auto-save pesanan pelanggan.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#b80c1d] hover:bg-[#8b0000] text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Katalog Menu */}
        {activeTab === 'menu' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-stone-500">
                Kelola status ketersediaan dan harga menu
              </span>
              <div className="flex items-center gap-2">
                {onReloadFromDB && (
                  <button
                    onClick={async () => {
                      await onReloadFromDB();
                      alert('Berhasil disinkronkan langsung dengan file database DB_DIMSUMANYU!');
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    title="Muat ulang menu langsung dari file DB_DIMSUMANYU"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sinkronkan DB Asli</span>
                  </button>
                )}
                <button
                  onClick={() => setIsBulkImportOpen(!isBulkImportOpen)}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Impor / Tempel Menu</span>
                </button>
                <button
                  onClick={() => setIsAddingMenu(!isAddingMenu)}
                  className="px-3 py-1.5 bg-[#b80c1d] hover:bg-[#8b0000] text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Menu</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Kembalikan katalog ke menu default awal?')) {
                      onResetMenu();
                    }
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Bulk Import Box if opened */}
            {isBulkImportOpen && (
              <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-xs text-white">
                      Impor / Tempel Daftar Menu dari Spreadsheet
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Salin kolom dari Google Sheet / Excel Anda lalu tempel di sini. Format per baris: <br />
                      <code className="text-amber-300">Nama Menu, Kategori, Harga, Keterangan, Porsi</code>
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBulkImportOpen(false)}
                    className="text-stone-400 hover:text-white text-xs"
                  >
                    Tutup
                  </button>
                </div>

                {bulkError && (
                  <div className="text-[11px] text-red-300 bg-red-950/80 p-2 rounded-lg border border-red-800">
                    {bulkError}
                  </div>
                )}

                <textarea
                  rows={5}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`Contoh:\nDimsum Ayam Original, Dimsum Kukus, 15000, BEST SELLER, Isi 4 pcs\nDimsum Udang Jamur, Dimsum Kukus, 18000, BEST SELLER, Isi 4 pcs\nDimsum Mentai Torched, Dimsum Mentai, 22000, BEST SELLER, Isi 4 pcs\nEs Teh Manis Segar, Minuman Segar, 5000, , Cup 16 oz`}
                  className="w-full p-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkImportOpen(false)}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkImport}
                    className="px-4 py-1.5 bg-[#b80c1d] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Terapkan & Ganti Menu
                  </button>
                </div>
              </div>
            )}

            {/* Add menu modal / form if opened */}
            {isAddingMenu && (
              <form onSubmit={handleAddNewMenu} className="p-4 bg-stone-50 border border-stone-300 rounded-2xl space-y-3 mb-4">
                <h4 className="font-extrabold text-xs text-stone-900">Tambah Menu Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Nama Menu *</label>
                    <input
                      type="text"
                      required
                      value={newMenu.nama}
                      onChange={(e) => setNewMenu({ ...newMenu, nama: e.target.value })}
                      placeholder="e.g. Dimsum Mozzarella Smoke Beef"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Kategori</label>
                    <select
                      value={newMenu.kategori}
                      onChange={(e) => setNewMenu({ ...newMenu, kategori: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="Dimsum Kukus">Dimsum Kukus</option>
                      <option value="Dimsum Mentai">Dimsum Mentai</option>
                      <option value="Dimsum Goreng">Dimsum Goreng</option>
                      <option value="Frozen & Paket">Frozen & Paket</option>
                      <option value="Saus & Topping">Saus & Topping</option>
                      <option value="Minuman Segar">Minuman Segar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      value={newMenu.harga}
                      onChange={(e) => setNewMenu({ ...newMenu, harga: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Porsi / Isi</label>
                    <input
                      type="text"
                      value={newMenu.porsi}
                      onChange={(e) => setNewMenu({ ...newMenu, porsi: e.target.value })}
                      placeholder="e.g. Isi 4 pcs + Saus Merah"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingMenu(false)}
                    className="px-3 py-1 text-xs text-stone-600 hover:text-stone-900"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#b80c1d] text-white rounded-lg text-xs font-bold"
                  >
                    Simpan Menu Baru
                  </button>
                </div>
              </form>
            )}

            {/* Menu items table */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-stone-500 font-medium">{item.kategori}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-[10px] text-stone-400">{item.porsi}</span>
                      {item.keterangan?.includes('BEST SELLER') && (
                        <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">
                          BEST SELLER
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-stone-900 text-sm truncate">{item.nama}</h5>
                    <p className="text-[10px] text-stone-500 truncate max-w-md">{item.deskripsi}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Price edit */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-stone-400">Rp</span>
                      <input
                        type="number"
                        value={item.harga}
                        onChange={(e) => handleUpdatePrice(item.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded-lg border border-stone-300 bg-white font-mono font-bold text-xs"
                      />
                    </div>

                    {/* Best Seller toggle */}
                    <button
                      onClick={() => handleToggleBestSeller(item.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                        item.keterangan?.includes('BEST SELLER')
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                      title="Tandai Best Seller"
                    >
                      Best Seller
                    </button>

                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleItemStatus(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        item.status === 'TERSEDIA'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {item.status === 'TERSEDIA' ? 'Tersedia' : 'Habis'}
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pesanan Masuk */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs text-stone-500">
                Log semua pesanan pelanggan yang masuk ({orders.length} pesanan)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportOrdersCSV}
                  disabled={orders.length === 0}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh CSV</span>
                </button>
                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Hapus seluruh riwayat pesanan masuk?')) {
                        onClearOrders();
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#b80c1d] rounded-xl text-xs font-semibold transition"
                  >
                    Bersihkan
                  </button>
                )}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center text-stone-400">
                <ListOrdered className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-1" />
                <p className="font-bold text-stone-700 text-xs">Belum ada pesanan yang tercatat</p>
                <p className="text-[11px] text-stone-500">
                  Saat pembeli menekan tombol 'Kirim Pesanan via WhatsApp', rincian akan tampil di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">{ord.invoiceNumber}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(ord.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="font-semibold text-stone-800 mt-0.5">
                          {ord.nama} · <span className="font-mono">{ord.phone}</span>
                        </p>
                        <p className="text-[11px] text-stone-500">{ord.alamat}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderRecord['status'])}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-300 bg-white"
                        >
                          <option value="Baru">Baru</option>
                          <option value="Diproses">Diproses</option>
                          <option value="Siap">Siap Diantar</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                        <span className="font-extrabold text-[#b80c1d] font-mono tabular-nums text-sm">
                          {formatRupiah(ord.totalHarga)}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-700">
                      <div className="font-bold text-stone-500 text-[10px] mb-1">Rincian Item:</div>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• {it.nama} ({it.qty}x)</span>
                          <span className="font-mono tabular-nums">{formatRupiah(it.subtotal)}</span>
                        </div>
                      ))}
                      {ord.catatan && (
                        <div className="mt-1 pt-1 border-t border-stone-100 text-stone-500 italic">
                          Note: {ord.catatan}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-stone-500">
                        Metode: <b>{ord.metodeBayar}</b>
                      </span>
                      <a
                        href={`https://wa.me/${ord.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat Pembeli</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
