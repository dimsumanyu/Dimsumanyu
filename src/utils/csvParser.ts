import { MenuItem } from '../types';
import { IMAGES } from '../data/initialData';

export function parseDimsumCSV(text: string): MenuItem[] {
  const rows: string[][] = [];
  let curRow: string[] = [];
  let curVal = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      curRow.push(curVal.trim());
      curVal = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (curVal.length > 0 || curRow.length > 0) {
        curRow.push(curVal.trim());
        if (curRow.some((col) => col.length > 0)) {
          rows.push(curRow);
        }
        curRow = [];
        curVal = '';
      }
    } else {
      curVal += ch;
    }
  }

  if (curVal.length > 0 || curRow.length > 0) {
    curRow.push(curVal.trim());
    if (curRow.some((col) => col.length > 0)) {
      rows.push(curRow);
    }
  }

  if (rows.length <= 1) return [];

  // Skip header: MENU,KATEGORI,HARGA,STATUS,KETERANGAN
  return rows.slice(1).map((cols, idx) => {
    const rawMenu = (cols[0] || '').replace(/^"|"$/g, '').trim();
    // Split lines if menu has detail in parentheses
    const menuLines = rawMenu.split('\n').map((l) => l.trim()).filter(Boolean);
    const title = menuLines[0] || rawMenu;
    const detail = menuLines.slice(1).join(' ') || '';

    const kategori = (cols[1] || 'DIMSUM KUKUS').trim();
    const rawHarga = (cols[2] || '0').replace(/[^\d]/g, '');
    const harga = parseInt(rawHarga, 10) || 0;
    const status = (cols[3] || 'TERSEDIA').trim().toUpperCase() as 'TERSEDIA' | 'HABIS';
    const keterangan = (cols[4] || '').trim();

    // Map picture by menu type
    let gambar = IMAGES.ayamOriginal;
    const upperName = rawMenu.toUpperCase();
    const upperKat = kategori.toUpperCase();

    if (upperKat.includes('DRINK') || upperName.includes('TEA')) {
      gambar = IMAGES.heroBanner;
    } else if (upperName.includes('MENTAI')) {
      gambar = IMAGES.mentaiTorched;
    } else if (upperKat.includes('GORENG') || upperName.includes('GORENG')) {
      gambar = IMAGES.gorengKrispi;
    } else if (upperKat.includes('MIX') || upperKat.includes('FAMILY') || upperName.includes('PLATTER')) {
      gambar = IMAGES.partyBox;
    } else if (upperKat.includes('KUKUS')) {
      gambar = IMAGES.ayamOriginal;
    }

    // Determine portions
    let porsi = detail || '';
    if (!porsi) {
      const matchPcs = title.match(/ISI\s+(\d+)\s*PCS/i);
      if (matchPcs) {
        porsi = `Isi ${matchPcs[1]} pcs`;
      } else if (upperKat === 'DRINK') {
        porsi = 'Cup Dingin 16 oz';
      } else {
        porsi = 'Porsi Siap Saji';
      }
    }

    return {
      id: `dimsum-db-${idx + 1}`,
      nama: title,
      kategori,
      harga,
      status: status === 'HABIS' ? 'HABIS' : 'TERSEDIA',
      keterangan,
      deskripsi: detail
        ? `${detail} - Olahan daging padat, juicy, dan lezat khas Anyu.`
        : `${title} - Olahan dimsum daging padat #SensasiNgedaging dengan saus spesial.`,
      porsi,
      gambar
    };
  });
}
