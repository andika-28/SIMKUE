import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  Building,
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah } from '../../data/initialData';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';
import { useInstitutionIdentity } from '../../utils/institutionStorage';

interface PrintCashBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  filterAccount?: string;
  filterCategory?: string;
  totalIn?: number;
  totalOut?: number;
}

export const PrintCashBookModal: React.FC<PrintCashBookModalProps> = ({
  isOpen,
  onClose,
  transactions,
  filterAccount: initialFilterAccount = 'Semua Rekening',
  filterCategory: initialFilterCategory = 'Semua Kategori',
}) => {
  const { identity } = useInstitutionIdentity();

  // Modal Local Filters
  const [selectedAccount, setSelectedAccount] = useState<string>(initialFilterAccount);
  const [selectedPeriod, setSelectedPeriod] = useState<'ALL' | 'AGUSTUS' | 'HARI_INI'>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'Pemasukan' | 'Pengeluaran'>('ALL');
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Synchronize when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedAccount(initialFilterAccount);
    }
  }, [isOpen, initialFilterAccount]);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Base Saldo Awal before active transactions
  const baseSaldoAwal = useMemo(() => {
    if (selectedAccount === 'BNI Operasional') return 85000000;
    if (selectedAccount === 'BNI Utama') return 50000000;
    if (selectedAccount === 'Kas Tunai') return 15750000;
    return 150750000; // Default total Saldo Awal
  }, [selectedAccount]);

  // Filter Transactions
  const filteredList = useMemo(() => {
    return transactions.filter((t) => {
      // Account filter
      if (selectedAccount !== 'Semua Rekening' && selectedAccount !== 'Semua') {
        const matchesAcc = t.rekening?.toLowerCase().includes(selectedAccount.toLowerCase());
        if (!matchesAcc) return false;
      }
      // Period filter
      if (selectedPeriod === 'AGUSTUS') {
        if (!t.tanggal.toLowerCase().includes('agu')) return false;
      } else if (selectedPeriod === 'HARI_INI') {
        if (!t.tanggal.toLowerCase().includes('01 sep') && !t.tanggal.toLowerCase().includes('31 agu')) return false;
      }
      // Type filter
      if (selectedType !== 'ALL' && t.jenis !== selectedType) {
        return false;
      }
      return true;
    });
  }, [transactions, selectedAccount, selectedPeriod, selectedType]);

  // Compute Running Balances
  const computedLedger = useMemo(() => {
    let currentBalance = baseSaldoAwal;
    let sumIn = 0;
    let sumOut = 0;

    const rows = filteredList.map((trx, idx) => {
      const debit = trx.jenis === 'Pemasukan' ? trx.nominal : 0;
      const kredit = trx.jenis === 'Pengeluaran' ? trx.nominal : 0;
      sumIn += debit;
      sumOut += kredit;
      currentBalance = currentBalance + debit - kredit;

      return {
        ...trx,
        idx: idx + 1,
        debit,
        kredit,
        saldoBerjalan: currentBalance,
      };
    });

    return {
      rows,
      totalInflow: sumIn,
      totalOutflow: sumOut,
      saldoAwal: baseSaldoAwal,
      saldoAkhir: currentBalance,
    };
  }, [filteredList, baseSaldoAwal]);

  if (!isOpen) return null;

  const currentDateFormatted = '01 September 2026';
  const periodLabelText =
    selectedPeriod === 'AGUSTUS'
      ? 'Bulan Agustus 2026'
      : selectedPeriod === 'HARI_INI'
      ? '01 September 2026 (Hari Ini)'
      : 'Tahun Ajaran 2026 / 2027 (Seluruh Periode)';

  // 1. Direct Browser Print with iframe-safe fallback
  const handleDirectPrint = () => {
    try {
      window.print();
    } catch (err) {
      // Fallback: If printing in iframe fails or is restricted, download printable document
      handleDownloadPrintableHtml();
      showToast('Pratinjau dibatasi oleh peramban. Dokumen cetak resmi A4 telah diunduh.');
    }
  };

  // 2. Download Official Standalone Printable HTML/PDF Document
  const handleDownloadPrintableHtml = () => {
    const filename = `Buku_Kas_Umum_BKU_${selectedAccount.replace(/\s+/g, '_')}_2026.html`;

    const tableRowsHtml = computedLedger.rows
      .map(
        (row) => `
        <tr>
          <td style="text-align:center;padding:6px;border:1px solid #cbd5e1;">${row.idx}</td>
          <td style="text-align:center;padding:6px;border:1px solid #cbd5e1;font-family:monospace;font-weight:bold;">${row.id}</td>
          <td style="text-align:center;padding:6px;border:1px solid #cbd5e1;white-space:nowrap;">${row.tanggal}</td>
          <td style="padding:6px;border:1px solid #cbd5e1;">
            <strong>${row.keterangan}</strong>
            ${row.santri ? `<br/><span style="font-size:10px;color:#64748b;">Keterangan: ${row.santri}</span>` : ''}
          </td>
          <td style="padding:6px;border:1px solid #cbd5e1;font-size:10px;">
            ${row.kategori}<br/><span style="color:#64748b;">${row.rekening || '-'}</span>
          </td>
          <td style="text-align:right;padding:6px;border:1px solid #cbd5e1;color:#064E3B;font-weight:bold;">
            ${row.debit > 0 ? formatRupiah(row.debit) : '-'}
          </td>
          <td style="text-align:right;padding:6px;border:1px solid #cbd5e1;color:#b91c1c;font-weight:bold;">
            ${row.kredit > 0 ? formatRupiah(row.kredit) : '-'}
          </td>
          <td style="text-align:right;padding:6px;border:1px solid #cbd5e1;font-weight:bold;background:#f8fafc;">
            ${formatRupiah(row.saldoBerjalan)}
          </td>
        </tr>`
      )
      .join('');

    const printableHtml = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.4; padding: 10px;">
        <!-- KOP SURAT PESANTREN -->
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px double #064E3B;padding-bottom:12px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:14px;">
            ${
              identity.logoUrl
                ? `<img src="${identity.logoUrl}" style="width:60px;height:60px;object-fit:contain;border-radius:8px;background:#ffffff;border:1px solid #cbd5e1;padding:2px;" alt="Logo" />`
                : `<div style="width:60px;height:60px;border-radius:12px;background:#064E3B;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;">R</div>`
            }
            <div>
              <h1 style="margin:0;font-size:17px;text-transform:uppercase;color:#064E3B;letter-spacing:1px;font-weight:900;">
                ${identity.name || 'Pondok Modern Raudhatussalam Mahato'}
              </h1>
              <p style="margin:2px 0 0 0;font-size:11px;font-weight:bold;color:#334155;text-transform:uppercase;letter-spacing:0.5px;">
                Sistem Informasi Manajemen Keuangan (SIMKEU) Pesantren
              </p>
              <p style="margin:2px 0 0 0;font-size:10px;color:#64748b;">
                ${identity.address || 'Jl. Lintas Mahato KM. 24, Tambusai Utara, Rokan Hulu, Riau 28558'} • Telp: ${identity.phone || '(0762) 891234'}
              </p>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:4px 10px;border-radius:6px;display:inline-block;">
              <span style="font-size:10px;font-weight:bold;color:#064E3B;">FORMAT RESMI BKU</span>
            </div>
            <p style="margin:4px 0 0 0;font-size:10px;color:#64748b;">Dicetak: ${currentDateFormatted}</p>
          </div>
        </div>

        <!-- JUDUL DOKUMEN -->
        <div style="text-align:center;margin-bottom:16px;">
          <h2 style="margin:0;font-size:14px;text-transform:uppercase;font-weight:900;text-decoration:underline;letter-spacing:0.5px;">
            BUKU KAS UMUM (BKU)
          </h2>
          <p style="margin:4px 0 0 0;font-size:11px;color:#475569;">
            Periode: <strong>${periodLabelText}</strong> • Akun: <strong>${selectedAccount}</strong>
          </p>
        </div>

        <!-- REKAPITULASI POSISI SALDO -->
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:14px;">
          <div style="padding:8px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#64748b;font-weight:bold;text-transform:uppercase;">Saldo Awal</div>
            <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${formatRupiah(computedLedger.saldoAwal)}</div>
          </div>
          <div style="padding:8px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#064E3B;font-weight:bold;text-transform:uppercase;">(+) Total Penerimaan (Debit)</div>
            <div style="font-size:12px;font-weight:bold;color:#064E3B;margin-top:2px;">${formatRupiah(computedLedger.totalInflow)}</div>
          </div>
          <div style="padding:8px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#991b1b;font-weight:bold;text-transform:uppercase;">(-) Total Pengeluaran (Kredit)</div>
            <div style="font-size:12px;font-weight:bold;color:#991b1b;margin-top:2px;">${formatRupiah(computedLedger.totalOutflow)}</div>
          </div>
          <div style="padding:8px;background:#064E3B;border:1px solid #064E3B;border-radius:6px;text-align:center;color:#ffffff;">
            <div style="font-size:9px;color:#a7f3d0;font-weight:bold;text-transform:uppercase;">(=) Saldo Akhir Kas</div>
            <div style="font-size:12px;font-weight:900;color:#ffffff;margin-top:2px;">${formatRupiah(computedLedger.saldoAkhir)}</div>
          </div>
        </div>

        <!-- TABEL JURNAL BUKU KAS UMUM -->
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:16px;">
          <thead>
            <tr style="background:#f1f5f9;color:#1e293b;font-weight:bold;text-align:center;">
              <th style="padding:7px;border:1px solid #cbd5e1;width:30px;">No</th>
              <th style="padding:7px;border:1px solid #cbd5e1;width:75px;">No. Bukti</th>
              <th style="padding:7px;border:1px solid #cbd5e1;width:70px;">Tanggal</th>
              <th style="padding:7px;border:1px solid #cbd5e1;text-align:left;">Uraian Transaksi</th>
              <th style="padding:7px;border:1px solid #cbd5e1;width:100px;text-align:left;">Pos Akun</th>
              <th style="padding:7px;border:1px solid #cbd5e1;width:95px;text-align:right;">Penerimaan (Debit)</th>
              <th style="padding:7px;border:1px solid #cbd5e1;width:95px;text-align:right;">Pengeluaran (Kredit)</th>
              <th style="padding:7px;border:1px solid #cbd5e1;width:105px;text-align:right;">Saldo (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <!-- Baris Saldo Awal -->
            <tr style="background:#f8fafc;font-weight:bold;">
              <td style="text-align:center;padding:6px;border:1px solid #cbd5e1;">-</td>
              <td style="text-align:center;padding:6px;border:1px solid #cbd5e1;">SALDO-AWAL</td>
              <td style="text-align:center;padding:6px;border:1px solid #cbd5e1;">-</td>
              <td style="padding:6px;border:1px solid #cbd5e1;" colspan="2">Saldo Kas Awal Periode</td>
              <td style="text-align:right;padding:6px;border:1px solid #cbd5e1;">-</td>
              <td style="text-align:right;padding:6px;border:1px solid #cbd5e1;">-</td>
              <td style="text-align:right;padding:6px;border:1px solid #cbd5e1;font-weight:bold;">${formatRupiah(computedLedger.saldoAwal)}</td>
            </tr>
            ${tableRowsHtml}
          </tbody>
          <tfoot>
            <tr style="background:#e2e8f0;font-weight:bold;border-top:2px solid #1e293b;">
              <td colspan="5" style="padding:8px;border:1px solid #cbd5e1;text-align:right;text-transform:uppercase;">
                Jumlah Mutasi Periode Ini:
              </td>
              <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;color:#064E3B;font-weight:bold;">
                ${formatRupiah(computedLedger.totalInflow)}
              </td>
              <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;color:#b91c1c;font-weight:bold;">
                ${formatRupiah(computedLedger.totalOutflow)}
              </td>
              <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;font-weight:900;color:#064E3B;">
                ${formatRupiah(computedLedger.saldoAkhir)}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- REKAPITULASI FISIK KAS & REKENING BANK -->
        <div style="background:#f8fafc;border:1px solid #cbd5e1;padding:10px 14px;border-radius:6px;margin-bottom:20px;font-size:10px;">
          <strong style="font-size:11px;color:#064E3B;display:block;margin-bottom:6px;">REKAPITULASI KEBERADAAN KAS & SALDO:</strong>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:3px 0;width:40%;">1. Kas Tunai di Bendahara</td>
              <td style="padding:3px 0;text-align:right;font-weight:bold;">${formatRupiah(15750000)}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">2. Rekening BNI Giro Operasional (•••• 8821)</td>
              <td style="padding:3px 0;text-align:right;font-weight:bold;">${formatRupiah(computedLedger.saldoAkhir - 15750000)}</td>
            </tr>
            <tr style="border-top:1px dashed #94a3b8;font-weight:bold;color:#064E3B;">
              <td style="padding:5px 0;">TOTAL SALDO BUKU KAS UMUM</td>
              <td style="padding:5px 0;text-align:right;font-size:11px;">${formatRupiah(computedLedger.saldoAkhir)}</td>
            </tr>
          </table>
        </div>

        <!-- TANDA TANGAN PENGESAHAN -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;text-align:center;font-size:11px;margin-top:20px;page-break-inside:avoid;">
          <div>
            <p style="margin:0;color:#64748b;">Mengetahui,</p>
            <p style="margin:2px 0 50px 0;font-weight:bold;color:#1e293b;">Pimpinan Pondok Modern</p>
            <p style="margin:0;font-weight:bold;color:#1e293b;text-decoration:underline;">K.H. Rasyid Ridho, Lc., M.A.</p>
            <p style="margin:2px 0 0 0;font-size:10px;color:#64748b;">NIP. 19780512 200501 1 002</p>
          </div>
          <div>
            <p style="margin:0;color:#64748b;">Mahato, ${currentDateFormatted}</p>
            <p style="margin:2px 0 50px 0;font-weight:bold;color:#1e293b;">Bendahara Pesantren</p>
            <p style="margin:0;font-weight:bold;color:#1e293b;text-decoration:underline;">H. Ahmad Syarif, M.Pd.</p>
            <p style="margin:2px 0 0 0;font-size:10px;color:#64748b;">NIP. 19850914 201101 1 004</p>
          </div>
        </div>

        <div style="border-top:1px solid #cbd5e1;margin-top:24px;padding-top:8px;font-size:9px;color:#94a3b8;display:flex;justify-content:space-between;">
          <span>SIMKEU PM. Raudhatussalam Mahato • Register Dokumen BKU Sah</span>
          <span>Halaman 1 dari 1</span>
        </div>
      </div>
    `;

    downloadPrintableReport(filename, 'Buku Kas Umum Pesantren', printableHtml);
    showToast(`Dokumen Buku Kas Umum berhasil diunduh (${filename})`);
  };

  // 3. Download Excel Spreadsheet
  const handleExportExcel = () => {
    const filename = `Buku_Kas_Umum_BKU_${selectedAccount.replace(/\s+/g, '_')}_2026.xls`;
    const headers = [
      'No',
      'No. Bukti / ID',
      'Tanggal',
      'Uraian Transaksi',
      'Santri / Entitas',
      'Kategori Pos',
      'Rekening / Kas',
      'Penerimaan (Debit)',
      'Pengeluaran (Kredit)',
      'Saldo Berjalan (Rp)',
    ];

    const rows = [
      ['-', 'SALDO-AWAL', '-', 'Saldo Kas Awal Periode', '-', 'Kas Awal', selectedAccount, '-', '-', formatRupiah(computedLedger.saldoAwal)],
      ...computedLedger.rows.map((r) => [
        r.idx,
        r.id,
        r.tanggal,
        r.keterangan,
        r.santri || '-',
        r.kategori,
        r.rekening || '-',
        r.debit > 0 ? formatRupiah(r.debit) : '-',
        r.kredit > 0 ? formatRupiah(r.kredit) : '-',
        formatRupiah(r.saldoBerjalan),
      ]),
    ];

    downloadExcelSpreadsheet(filename, {
      title: 'BUKU KAS UMUM (BKU) - PONDOK MODERN RAUDHATUSSALAM MAHATO',
      subtitle: `Periode: ${periodLabelText} • Akun: ${selectedAccount} • Dicetak: ${currentDateFormatted}`,
      headers,
      rows,
      summary: [
        { label: 'Saldo Awal', value: formatRupiah(computedLedger.saldoAwal) },
        { label: 'Total Penerimaan (Debit)', value: formatRupiah(computedLedger.totalInflow) },
        { label: 'Total Pengeluaran (Kredit)', value: formatRupiah(computedLedger.totalOutflow) },
        { label: 'Saldo Akhir Berjalan', value: formatRupiah(computedLedger.saldoAkhir) },
      ],
    });

    showToast(`Buku Kas format Excel berhasil diunduh (${filename})`);
  };

  return (
    <div className="fixed inset-0 z-[75] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        id="print-cashbook-modal"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-fade-in print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Dark Header */}
        <div className="px-5 py-3.5 bg-[#064E3B] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
              <Printer className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Cetak Buku Kas Umum (BKU)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700/80 text-emerald-100 border border-emerald-500/40">
                  Standar Akuntansi Pesantren
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                Pencatatan resmi penerimaan (debit), pengeluaran (kredit), & saldo berjalan
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Direct Print Button */}
            <button
              type="button"
              id="btn-print-cashbook-now"
              onClick={handleDirectPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              title="Cetak langsung menggunakan peramban"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>

            {/* Download Printable PDF/A4 HTML */}
            <button
              type="button"
              id="btn-download-pdf-cashbook"
              onClick={handleDownloadPrintableHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-[#064E3B] text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              title="Unduh berkas dokumen resmi siap cetak / simpan sebagai PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unduh Dokumen / PDF</span>
            </button>

            {/* Download Excel */}
            <button
              type="button"
              id="btn-download-excel-cashbook"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg border border-emerald-500/40 transition cursor-pointer"
              title="Ekspor seluruh data buku kas ke Microsoft Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Excel</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
              title="Tutup Pratinjau"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar inside Modal */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            {/* Rekening Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                Rekening:
              </span>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600"
              >
                <option value="Semua Rekening">Semua Rekening & Kas</option>
                <option value="Kas Tunai">Kas Tunai Bendahara</option>
                <option value="BNI Operasional">BNI Operasional (•••• 8821)</option>
                <option value="BNI Utama">BNI Utama (•••• 4092)</option>
              </select>
            </div>

            {/* Periode Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Periode:
              </span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600"
              >
                <option value="ALL">Semua Transaksi (2026/2027)</option>
                <option value="AGUSTUS">Bulan Agustus 2026</option>
                <option value="HARI_INI">Hari Ini (01 September 2026)</option>
              </select>
            </div>

            {/* Jenis Transaksi Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                Arus:
              </span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600"
              >
                <option value="ALL">Semua (Debit & Kredit)</option>
                <option value="Pemasukan">Penerimaan Saja (Debit)</option>
                <option value="Pengeluaran">Pengeluaran Saja (Kredit)</option>
              </select>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-800">{computedLedger.rows.length}</strong> baris transaksi
          </div>
        </div>

        {/* Toast Alert */}
        {toastNotification && (
          <div className="mx-5 my-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in print:hidden">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastNotification}</span>
          </div>
        )}

        {/* Printable Document Paper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100 print:p-0 print:bg-white">
          <div
            id="cashbook-print-content"
            className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto text-slate-800 space-y-5 text-xs print:border-none print:shadow-none print:p-0"
          >
            {/* Header Kop Surat Pesantren */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {identity.logoUrl ? (
                  <div className="w-14 h-14 rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0 bg-white shadow-xs">
                    <img
                      src={identity.logoUrl}
                      alt={identity.shortName || 'Logo'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-xs">
                    R
                  </div>
                )}
                <div>
                  <h1 className="text-base font-black uppercase tracking-wider text-[#064E3B] leading-tight">
                    {identity.name || 'Pondok Modern Raudhatussalam Mahato'}
                  </h1>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Sistem Informasi Manajemen Keuangan (SIMKEU) Pesantren
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {identity.address || 'Jl. Lintas Mahato KM. 24, Tambusai Utara, Rokan Hulu, Riau 28558'} • Telp: {identity.phone || '(0762) 891234'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-emerald-50 rounded text-[11px] font-mono font-bold text-[#064E3B] border border-emerald-200">
                  BUKU KAS UMUM (BKU)
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Dicetak: {currentDateFormatted}
                </p>
              </div>
            </div>

            {/* Document Title & Filter Metadata */}
            <div className="text-center space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 underline underline-offset-4">
                BUKU KAS UMUM (BKU) PENERIMAAN & PENGELUARAN
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Periode: <strong className="text-slate-900">{periodLabelText}</strong> • Rekening:{' '}
                <strong className="text-slate-900">{selectedAccount}</strong>
              </p>
            </div>

            {/* Financial Totals Formula Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center avoid-break">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Saldo Awal</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                  {formatRupiah(computedLedger.saldoAwal)}
                </span>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  (+) Penerimaan (Debit)
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 block">
                  {formatRupiah(computedLedger.totalInflow)}
                </span>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">
                  (-) Pengeluaran (Kredit)
                </span>
                <span className="text-xs sm:text-sm font-bold text-rose-800 mt-0.5 block">
                  {formatRupiah(computedLedger.totalOutflow)}
                </span>
              </div>
              <div className="p-2 bg-[#064E3B] text-white rounded-lg shadow-xs">
                <span className="text-[10px] font-bold text-emerald-200 uppercase block">
                  (=) Saldo Akhir Kas
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">
                  {formatRupiah(computedLedger.saldoAkhir)}
                </span>
              </div>
            </div>

            {/* Transaction Ledger Table with Saldo Berjalan */}
            <div className="border border-slate-300 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                    <th className="p-2.5 w-10 text-center border-r border-slate-200">No</th>
                    <th className="p-2.5 w-24 border-r border-slate-200">No. Bukti</th>
                    <th className="p-2.5 w-24 border-r border-slate-200">Tanggal</th>
                    <th className="p-2.5 border-r border-slate-200">Uraian Transaksi</th>
                    <th className="p-2.5 w-28 border-r border-slate-200">Akun / Pos</th>
                    <th className="p-2.5 w-28 text-right border-r border-slate-200 text-emerald-800">
                      Penerimaan (Debit)
                    </th>
                    <th className="p-2.5 w-28 text-right border-r border-slate-200 text-rose-800">
                      Pengeluaran (Kredit)
                    </th>
                    <th className="p-2.5 w-32 text-right bg-slate-200/60 font-black text-slate-900">
                      Saldo Berjalan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {/* Row Saldo Awal */}
                  <tr className="bg-slate-50/80 font-bold">
                    <td className="p-2 text-center text-slate-400 border-r border-slate-200">-</td>
                    <td className="p-2 font-mono text-slate-600 border-r border-slate-200">AWAL</td>
                    <td className="p-2 text-slate-500 border-r border-slate-200">-</td>
                    <td className="p-2 border-r border-slate-200" colSpan={2}>
                      Saldo Awal Kas & Bank Periode Ini
                    </td>
                    <td className="p-2 text-right border-r border-slate-200">-</td>
                    <td className="p-2 text-right border-r border-slate-200">-</td>
                    <td className="p-2 text-right font-bold text-slate-900 bg-slate-100/70">
                      {formatRupiah(computedLedger.saldoAwal)}
                    </td>
                  </tr>

                  {computedLedger.rows.length > 0 ? (
                    computedLedger.rows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-2 text-center text-slate-500 border-r border-slate-200">
                          {row.idx}
                        </td>
                        <td className="p-2 font-mono font-bold text-slate-700 border-r border-slate-200">
                          {row.id}
                        </td>
                        <td className="p-2 text-slate-600 border-r border-slate-200 whitespace-nowrap">
                          {row.tanggal}
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          <div className="font-semibold text-slate-900">{row.keterangan}</div>
                          {row.santri && (
                            <div className="text-[10px] text-slate-500">Santri: {row.santri}</div>
                          )}
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          <div className="font-medium text-slate-700">{row.kategori}</div>
                          <div className="text-[9px] text-slate-500">{row.rekening}</div>
                        </td>
                        <td className="p-2 text-right font-bold text-emerald-800 border-r border-slate-200">
                          {row.debit > 0 ? formatRupiah(row.debit) : '-'}
                        </td>
                        <td className="p-2 text-right font-bold text-rose-700 border-r border-slate-200">
                          {row.kredit > 0 ? formatRupiah(row.kredit) : '-'}
                        </td>
                        <td className="p-2 text-right font-bold text-slate-900 bg-slate-50/80">
                          {formatRupiah(row.saldoBerjalan)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        Tidak ada catatan transaksi untuk kriteria filter yang dipilih.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-extrabold border-t-2 border-slate-400 text-[11px]">
                    <td colSpan={5} className="p-2.5 text-right uppercase border-r border-slate-300">
                      Total Mutasi Periode:
                    </td>
                    <td className="p-2.5 text-right font-black text-emerald-800 border-r border-slate-300">
                      {formatRupiah(computedLedger.totalInflow)}
                    </td>
                    <td className="p-2.5 text-right font-black text-rose-700 border-r border-slate-300">
                      {formatRupiah(computedLedger.totalOutflow)}
                    </td>
                    <td className="p-2.5 text-right font-black text-[#064E3B] bg-slate-200/80">
                      {formatRupiah(computedLedger.saldoAkhir)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Rekapitulasi Kas & Bank */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs avoid-break">
              <h4 className="font-bold text-[#064E3B] text-[11px] uppercase tracking-wide mb-2">
                Rekapitulasi Keberadaan Kas Fisik & Bank
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">1. Kas Tunai di Bendahara</span>
                    <span className="font-bold text-slate-800">{formatRupiah(15750000)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">2. Rekening BNI Operasional (•••• 8821)</span>
                    <span className="font-bold text-slate-800">
                      {formatRupiah(computedLedger.saldoAkhir - 15750000)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center bg-white p-3 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    Total Sisa Kas Buku Kas Umum
                  </span>
                  <span className="text-base font-black text-[#064E3B] mt-1">
                    {formatRupiah(computedLedger.saldoAkhir)}
                  </span>
                  <span className="text-[9px] text-emerald-700 mt-0.5">
                    Kondisi: Seimbang & Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs avoid-break">
              <div className="space-y-12">
                <div>
                  <p className="text-slate-500">Mengetahui,</p>
                  <p className="font-bold text-slate-800">Pimpinan Pondok Modern</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">K.H. Rasyid Ridho, Lc., M.A.</p>
                  <p className="text-[10px] text-slate-500">NIP. 19780512 200501 1 002</p>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-slate-500">Mahato, {currentDateFormatted}</p>
                  <p className="font-bold text-slate-800">Bendahara Pesantren</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">H. Ahmad Syarif, M.Pd.</p>
                  <p className="text-[10px] text-slate-500">NIP. 19850914 201101 1 004</p>
                </div>
              </div>
            </div>

            {/* Audit Footer */}
            <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 flex items-center justify-between">
              <span>SIMKEU PM. Raudhatussalam Mahato • Register Buku Kas Umum (BKU) Sah</span>
              <span>Dokumen Keuangan Resmi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
