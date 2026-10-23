import { MenuItem, StoreConfig } from '../types';

export const DB_ATTACHMENT_PATH = '/assets/aistudio/DB_DIMSUMANYU_32b8c893';

// Real generated high-fidelity asset paths
export const IMAGES = {
  heroBanner: '/src/assets/images/dimsum_hero_steamer_1792724118231.jpg',
  ayamOriginal: '/src/assets/images/dimsum_ayam_original_1792724120574.jpg',
  mentaiTorched: '/src/assets/images/dimsum_mentai_torched_1792724120803.jpg',
  gorengKrispi: '/src/assets/images/dimsum_goreng_krispi_1792724121626.jpg',
  partyBox: '/src/assets/images/dimsum_party_box_1792724121669.jpg',
  qrisLocal: '/qris_dimsumanyu.jpg',
  qrisRemoteFallback: 'https://lh3.googleusercontent.com/d/1gYXHwwITOwt08okLCZChfGB0n5ibc98J'
};

export const INITIAL_STORE_CONFIG: StoreConfig = {
  namaToko: 'DIMSUMANYU',
  tagline: '#SensasiNgedaging',
  slogan: 'Pilihan dimsum olahan daging padat & lezat.',
  adminWaNumber: '6285754623156',
  bankName: 'Allo Bank',
  bankAccountName: 'Nadia Rizka Kurnaini',
  bankAccountNumber: '082254421916',
  qrisImageUrl: IMAGES.qrisLocal,
  jamOperasional: '10:00 - 21:30 WITA / WIB',
  lokasiToko: 'Balikpapan & Sekitarnya',
  alamatOutlet: 'Sentra Kuliner Dimsum Anyu, Tersedia Pengambilan di Tempat & Pengantaran Online',
  isOpen: true,
  appScriptUrl: 'https://script.google.com/macros/s/AKfycbwkawcrRY_1vZKKlWMMm5kAP5lO7BTosAh0Khv5_G1b3DUVS7vnHNo57DJuHnIopDilww/exec'
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // 1. DIMSUM KUKUS
  {
    id: 'dimsum-db-1',
    nama: 'KUKUS ORIGINAL ISI 6 PCS',
    kategori: 'DIMSUM KUKUS',
    harga: 25000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Dimsum kukus olahan daging ayam padat bertekstur lezat dibalut kulit lembut dengan saus khas Anyu.',
    porsi: 'Isi 6 pcs',
    gambar: IMAGES.ayamOriginal
  },
  {
    id: 'dimsum-db-2',
    nama: 'KUKUS MENTAI ISI 6 PCS',
    kategori: 'DIMSUM KUKUS',
    harga: 32000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: 'Dimsum kukus lembut disiram saus creamy mentai gurih dibakar api torched harum dengan taburan nori.',
    porsi: 'Isi 6 pcs',
    gambar: IMAGES.mentaiTorched
  },
  {
    id: 'dimsum-db-3',
    nama: 'KUKUS ORIGINAL ISI 8 PCS',
    kategori: 'DIMSUM KUKUS',
    harga: 33000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Porsi lebih puas 8 pcs dimsum kukus daging padat juicy dengan saus cocolan spesial.',
    porsi: 'Isi 8 pcs',
    gambar: IMAGES.ayamOriginal
  },
  {
    id: 'dimsum-db-4',
    nama: 'KUKUS MENTAI ISI 8 PCS',
    kategori: 'DIMSUM KUKUS',
    harga: 43000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: 'Porsi 8 pcs dimsum kukus dengan lumuran saus mentai bakar melimpah, wangi smokey dan gurih lumer.',
    porsi: 'Isi 8 pcs',
    gambar: IMAGES.mentaiTorched
  },

  // 2. DIMSUM GORENG
  {
    id: 'dimsum-db-5',
    nama: 'GORENG ORIGINAL ISI 5 PCS',
    kategori: 'DIMSUM GORENG',
    harga: 25000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Dimsum digoreng renyah garing di luar, daging ayam padat juicy di dalam. Lengkap dengan saus cocol.',
    porsi: 'Isi 5 pcs',
    gambar: IMAGES.gorengKrispi
  },
  {
    id: 'dimsum-db-6',
    nama: 'GORENG MENTAI ISI 5 PCS',
    kategori: 'DIMSUM GORENG',
    harga: 35000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: 'Dimsum krispi renyah berpadu saus mentai bakar gurih creamy pedas manis.',
    porsi: 'Isi 5 pcs',
    gambar: IMAGES.mentaiTorched
  },
  {
    id: 'dimsum-db-7',
    nama: 'GORENG ORIGINAL ISI 7 PCS',
    kategori: 'DIMSUM GORENG',
    harga: 35000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Porsi mantap 7 pcs dimsum goreng keemasan renyah bertekstur daging tebal.',
    porsi: 'Isi 7 pcs',
    gambar: IMAGES.gorengKrispi
  },
  {
    id: 'dimsum-db-8',
    nama: 'GORENG MENTAI ISI 7 PCS',
    kategori: 'DIMSUM GORENG',
    harga: 45000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '7 pcs dimsum goreng garing diselimuti saus mentai bakar melimpah.',
    porsi: 'Isi 7 pcs',
    gambar: IMAGES.mentaiTorched
  },

  // 3. PAKET MIX ISI 6
  {
    id: 'dimsum-db-9',
    nama: 'MIX ORIGINAL ISI 6 PCS',
    kategori: 'PAKET MIX ISI 6',
    harga: 28000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '3 Pcs Kukus Ori + 3 Pcs Goreng Ori. Nikmati dua sensasi kukus lembut & goreng renyah sekaligus.',
    porsi: '3 Pcs Kukus Ori + 3 Pcs Goreng Ori',
    gambar: IMAGES.partyBox
  },
  {
    id: 'dimsum-db-10',
    nama: 'MIX MENTAI ISI 6 PCS',
    kategori: 'PAKET MIX ISI 6',
    harga: 34000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: '3 Pcs Kukus Mentai + 3 Pcs Goreng Mentai dengan saus mentai torched bakar wangi gurih.',
    porsi: '3 Pcs Kukus Mentai + 3 Pcs Goreng Mentai',
    gambar: IMAGES.mentaiTorched
  },
  {
    id: 'dimsum-db-11',
    nama: 'MIX KUKUS ISI 6 PCS',
    kategori: 'PAKET MIX ISI 6',
    harga: 29000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '3 Pcs Kukus Ori + 3 Pcs Kukus Mentai. Sensasi kukus varian original & saus mentai bakar.',
    porsi: '3 Pcs Kukus Ori + 3 Pcs Kukus Mentai',
    gambar: IMAGES.ayamOriginal
  },
  {
    id: 'dimsum-db-12',
    nama: 'MIX GORENG ISI 6 PCS',
    kategori: 'PAKET MIX ISI 6',
    harga: 34000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '3 Pcs Goreng Ori + 3 Pcs Goreng Mentai. Renyahnya dimsum goreng berpadu saus mentai creamy.',
    porsi: '3 Pcs Goreng Ori + 3 Pcs Goreng Mentai',
    gambar: IMAGES.gorengKrispi
  },

  // 4. PAKET MIX ISI 8
  {
    id: 'dimsum-db-13',
    nama: 'MIX ORIGINAL ISI 8 PCS',
    kategori: 'PAKET MIX ISI 8',
    harga: 37000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '4 Pcs Kukus Ori + 4 Pcs Goreng Ori. Pilihan pas untuk berdua dengan aneka tekstur kukus dan goreng.',
    porsi: '4 Pcs Kukus Ori + 4 Pcs Goreng Ori',
    gambar: IMAGES.partyBox
  },
  {
    id: 'dimsum-db-14',
    nama: 'MIX MENTAI ISI 8 PCS',
    kategori: 'PAKET MIX ISI 8',
    harga: 47000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: '4 Pcs Kukus Mentai + 4 Pcs Goreng Mentai dengan topping mentai bakar torched gurih lezat.',
    porsi: '4 Pcs Kukus Mentai + 4 Pcs Goreng Mentai',
    gambar: IMAGES.mentaiTorched
  },
  {
    id: 'dimsum-db-15',
    nama: 'MIX KUKUS ISI 8 PCS',
    kategori: 'PAKET MIX ISI 8',
    harga: 38000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '4 Pcs Kukus Ori + 4 Pcs Kukus Mentai. Kombinasi lezat kukus original dan mentai bakar.',
    porsi: '4 Pcs Kukus Ori + 4 Pcs Kukus Mentai',
    gambar: IMAGES.ayamOriginal
  },
  {
    id: 'dimsum-db-16',
    nama: 'MIX GORENG ISI 8 PCS',
    kategori: 'PAKET MIX ISI 8',
    harga: 46000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '4 Pcs Goreng Ori + 4 Pcs Goreng Mentai. Renyah krispi 8 pcs dengan rasa original dan mentai gurih.',
    porsi: '4 Pcs Goreng Ori + 4 Pcs Goreng Mentai',
    gambar: IMAGES.gorengKrispi
  },

  // 5. PAKET FAMILY
  {
    id: 'dimsum-db-17',
    nama: 'KUKUS ORIGINAL ISI 16 PCS',
    kategori: 'PAKET FAMILY',
    harga: 72000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Porsi besar 16 pcs dimsum kukus original isi daging padat cocok untuk santap bersama keluarga.',
    porsi: 'Isi 16 pcs + Saus Merah',
    gambar: IMAGES.partyBox
  },
  {
    id: 'dimsum-db-18',
    nama: 'KUKUS MENTAI ISI 16 PCS',
    kategori: 'PAKET FAMILY',
    harga: 90000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Paket keluarga 16 pcs dimsum kukus bermandikan saus mentai bakar gurih lezat.',
    porsi: 'Isi 16 pcs + Saus Mentai',
    gambar: IMAGES.mentaiTorched
  },
  {
    id: 'dimsum-db-19',
    nama: 'GORENG ORIGINAL ISI 16 PCS',
    kategori: 'PAKET FAMILY',
    harga: 86000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '16 pcs dimsum goreng renyah keemasan dalam kemasan family box higienis.',
    porsi: 'Isi 16 pcs + Saus Cocol',
    gambar: IMAGES.gorengKrispi
  },
  {
    id: 'dimsum-db-20',
    nama: 'GORENG MENTAI ISI 16 PCS',
    kategori: 'PAKET FAMILY',
    harga: 111000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '16 pcs dimsum goreng krispi dengan limpahan saus mentai bakar khas Anyu.',
    porsi: 'Isi 16 pcs + Saus Mentai',
    gambar: IMAGES.mentaiTorched
  },
  {
    id: 'dimsum-db-21',
    nama: 'KUKUS ORIGINAL JUMBO 16 PCS',
    kategori: 'PAKET FAMILY',
    harga: 108000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Pilihan porsi super puas 16 pcs dimsum kukus daging padat berukuran jumbo premium.',
    porsi: 'Isi 16 pcs Jumbo',
    gambar: IMAGES.partyBox
  },
  {
    id: 'dimsum-db-22',
    nama: 'KUKUS MENTAI JUMBO 16 PCS',
    kategori: 'PAKET FAMILY',
    harga: 134000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: 'Paket super family 16 pcs dimsum kukus jumbo berselimut saus mentai bakar spesial.',
    porsi: 'Isi 16 pcs Jumbo + Mentai',
    gambar: IMAGES.mentaiTorched
  },

  // 6. PAKET FAMILY MIX
  {
    id: 'dimsum-db-23',
    nama: 'MIX ORIGINAL FAMILY ISI 16 PCS',
    kategori: 'PAKET FAMILY MIX',
    harga: 82000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '8 Pcs Kukus Ori + 8 Pcs Goreng Ori. Pilihan sempurna untuk kumpul keluarga & arisan.',
    porsi: '8 Kukus Ori + 8 Goreng Ori',
    gambar: IMAGES.partyBox
  },
  {
    id: 'dimsum-db-24',
    nama: 'MIX MENTAI FAMILY ISI 16 PCS',
    kategori: 'PAKET FAMILY MIX',
    harga: 100000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '8 Pcs Kukus Mentai + 8 Pcs Goreng Mentai dengan saus mentai bakar gurih lumer.',
    porsi: '8 Kukus Mentai + 8 Goreng Mentai',
    gambar: IMAGES.mentaiTorched
  },
  {
    id: 'dimsum-db-25',
    nama: 'MIX KUKUS FAMILY ISI 16 PCS',
    kategori: 'PAKET FAMILY MIX',
    harga: 82000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '8 Pcs Kukus Ori + 8 Pcs Kukus Mentai. Sensasi kombinasi kukus lembut untuk pecinta dimsum kukus.',
    porsi: '8 Kukus Ori + 8 Kukus Mentai',
    gambar: IMAGES.ayamOriginal
  },
  {
    id: 'dimsum-db-26',
    nama: 'MIX GORENG FAMILY ISI 16 PCS',
    kategori: 'PAKET FAMILY MIX',
    harga: 100000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: '8 Pcs Goreng Ori + 8 Pcs Goreng Mentai. Renyah krispi 16 pcs aneka rasa goreng.',
    porsi: '8 Goreng Ori + 8 Goreng Mentai',
    gambar: IMAGES.gorengKrispi
  },
  {
    id: 'dimsum-db-27',
    nama: 'MINI MIX PLATTER ISI 8 PCS',
    kategori: 'PAKET FAMILY MIX',
    harga: 42000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: '2 Kukus Ori + 2 Kukus Mentai + 2 Pcs Goreng Ori + 2 Pcs Goreng Mentai. 4 varian favorit dalam 1 platter!',
    porsi: 'Isi 8 pcs (4 Varian Mix)',
    gambar: IMAGES.partyBox
  },
  {
    id: 'dimsum-db-28',
    nama: 'FAMILY MIX PLATTER ISI 16 PCS',
    kategori: 'PAKET FAMILY MIX',
    harga: 88000,
    status: 'TERSEDIA',
    keterangan: 'BEST SELLER',
    deskripsi: '4 Kukus Ori + 4 Kukus Mentai + 4 Pcs Goreng Ori + 4 Pcs Goreng Mentai. Platter terfavorit paling komplit!',
    porsi: 'Isi 16 pcs (4 Varian Mix Lengkap)',
    gambar: IMAGES.partyBox
  },

  // 7. DRINK
  {
    id: 'dimsum-db-29',
    nama: 'THAI TEA',
    kategori: 'DRINK',
    harga: 15000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Minuman teh khas Thailand dengan susu creamy manis pas yang menyegarkan tenggorokan.',
    porsi: 'Cup Dingin 16 oz',
    gambar: IMAGES.heroBanner
  },
  {
    id: 'dimsum-db-30',
    nama: 'GREEN TEA MILK',
    kategori: 'DRINK',
    harga: 15000,
    status: 'TERSEDIA',
    keterangan: '',
    deskripsi: 'Minuman matcha green tea berpadu susu segar dingin harum aromatik.',
    porsi: 'Cup Dingin 16 oz',
    gambar: IMAGES.heroBanner
  }
];

export const CATEGORIES = [
  'SEMUA',
  'DIMSUM KUKUS',
  'DIMSUM GORENG',
  'PAKET MIX ISI 6',
  'PAKET MIX ISI 8',
  'PAKET FAMILY',
  'PAKET FAMILY MIX',
  'DRINK'
];
