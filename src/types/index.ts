export interface MenuItem {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  status: 'TERSEDIA' | 'HABIS';
  keterangan: string; // e.g. "BEST SELLER", "FAVORIT", "BARU"
  deskripsi: string;
  porsi: string; // e.g. "4 pcs", "10 pcs", "1 cup"
  gambar: string;
}

export interface CartItem {
  menu: MenuItem;
  qty: number;
  catatanItem?: string;
}

export type MetodePembayaran = 'QRIS' | 'Transfer Bank' | 'Tunai (COD / Ambil di Tempat)';
export type OpsiPengiriman = 'DIANTAR' | 'AMBIL_SENDIRI';

export interface OrderItem {
  id: string;
  nama: string;
  qty: number;
  harga: number;
  subtotal: number;
}

export interface OrderRecord {
  id: string;
  invoiceNumber: string;
  tanggal: string;
  nama: string;
  phone: string;
  alamat: string;
  metodePengiriman: OpsiPengiriman;
  metodeBayar: MetodePembayaran;
  catatan: string;
  items: OrderItem[];
  totalHarga: number;
  status: 'Baru' | 'Diproses' | 'Siap' | 'Selesai' | 'Dibatalkan';
}

export interface StoreConfig {
  namaToko: string;
  tagline: string;
  slogan: string;
  adminWaNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  qrisImageUrl: string;
  jamOperasional: string;
  lokasiToko: string;
  alamatOutlet: string;
  isOpen: boolean;
  appScriptUrl: string;
}
