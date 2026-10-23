import { OrderRecord, StoreConfig } from '../types';

export function formatRupiah(amount: number): string {
  return 'Rp ' + (amount || 0).toLocaleString('id-ID');
}

export function cleanIndonesianPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function buildWhatsAppMessage(config: StoreConfig, order: OrderRecord): string {
  let message = `*HALO ${config.namaToko.toUpperCase()}, SAYA MAU PESAN*\n`;
  message += `_${config.tagline}_\n`;
  message += `-------------------------------------------\n`;
  message += `*DATA PEMESAN:*\n`;
  message += `• *Nama:* ${order.nama}\n`;
  message += `• *No. WA:* ${order.phone}\n`;
  message += `• *Alamat/Pengambilan:* ${order.alamat}\n`;
  message += `• *Metode Pengiriman:* ${order.metodePengiriman === 'AMBIL_SENDIRI' ? 'Ambil Sendiri di Outlet' : 'Diantar ke Alamat'}\n`;
  message += `• *Metode Bayar:* ${order.metodeBayar}\n`;
  if (order.catatan && order.catatan.trim().length > 0) {
    message += `• *Catatan:* ${order.catatan.trim()}\n`;
  }
  message += `• *No. Invoice:* ${order.invoiceNumber}\n`;
  message += `-------------------------------------------\n`;
  message += `*RINCIAN PESANAN:*\n`;

  order.items.forEach(item => {
    message += `• ${item.nama} (${item.qty}x) = ${formatRupiah(item.subtotal)}\n`;
  });

  message += `-------------------------------------------\n`;
  message += `*TOTAL PEMBAYARAN: ${formatRupiah(order.totalHarga)}*\n`;
  message += `-------------------------------------------\n`;
  message += `Mohon segera diproses ya, terima kasih!`;

  return message;
}

export function generateWhatsAppLink(config: StoreConfig, order: OrderRecord): string {
  const targetNumber = cleanIndonesianPhone(config.adminWaNumber || '6285754623156');
  const message = buildWhatsAppMessage(config, order);
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

export function generateInvoiceCode(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `DM-${dateStr}-${randomSuffix}`;
}

export async function sendOrderToGoogleAppsScript(scriptUrl: string, order: OrderRecord): Promise<{ success: boolean; message: string }> {
  if (!scriptUrl || !scriptUrl.startsWith('http')) {
    return { success: false, message: 'URL Apps Script tidak valid' };
  }

  try {
    const payload = {
      nama: order.nama,
      phone: order.phone,
      alamat: order.alamat,
      metodeBayar: order.metodeBayar,
      catatan: order.catatan || '-',
      rincianMenu: order.items.map(i => `${i.nama} (${i.qty}x)`).join('\n'),
      totalHarga: order.totalHarga,
      invoice: order.invoiceNumber,
      tanggal: order.tanggal
    };

    // Google Apps Script Web App accepts POST or form data; no-cors avoids browser CORS preflight errors
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return { success: true, message: 'Pesanan tersinkronisasi ke Google Apps Script' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kendala koneksi';
    return { success: false, message };
  }
}
