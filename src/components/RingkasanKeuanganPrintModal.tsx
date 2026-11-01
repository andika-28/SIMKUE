import React, { useEffect, useState } from 'react';
import { X, Printer, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../data/initialData';
import { BudgetRealizationItem } from '../data/ringkasanKeuanganData';
import { downloadPrintableReport, downloadExcelSpreadsheet } from '../utils/fileDownloader';

interface RingkasanKeuanganPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: string;
  periodLabel?: string;
  unit: string;
  totalIncome?: number;
  totalExpense?: number;
  totalSurplus?: number;
  totalKasBank?: number;
  budgetItems?: BudgetRealizationItem[];
}

export const RingkasanKeuanganPrintModal: React.FC<RingkasanKeuanganPrintModalProps> = ({
  isOpen,
  onClose,
  period,
  periodLabel,
  unit,
  totalIncome = 0,
  totalExpense = 0,
  totalSurplus = 0,
  totalKasBank = 0,
  budgetItems,
}) => {
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-print-modal');
    } else {
      document.body.classList.remove('has-print-modal');
    }
    return () => {
      document.body.classList.remove('has-print-modal');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDateFormatted = '01 September 2026';

  const defaultBudgetRealization = [
    { pos: 'Penerimaan SPP & Biaya Santri', anggaran: 280000000, realisasi: 262000000, persen: '93.5%' },
    { pos: 'Infaq, Donasi & Wakaf Operasional', anggaran: 45000000, realisasi: 51200000, persen: '113.8%' },
    { pos: 'Unit Usaha Pesantren (Kantin/Kopontren)', anggaran: 35000000, realisasi: 38750000, persen: '110.7%' },
    { pos: 'Belanja Dapur Santri & Konsumsi', anggaran: 120000000, realisasi: 114500000, persen: '95.4%' },
    { pos: 'Honorarium Asatidz & Karyawan', anggaran: 85000000, realisasi: 85000000, persen: '100.0%' },
    { pos: 'Pemeliharaan Sarpras & Utilitas', anggaran: 30000000, realisasi: 24800000, persen: '82.7%' },
  ];

  const displayBudgetRealization = budgetItems
    ? budgetItems.map((b) => ({
        pos: b.kategori,
        anggaran: b.anggaran,
        realisasi: b.realisasi,
        persen: `${b.persen}%`,
      }))
    : defaultBudgetRealization;

  const bankBalances = [
    { bank: 'BNI Giro Utama Operasional (1928-1029-47)', saldo: Math.round(totalKasBank * 0.58) },
    { bank: 'BNI Virtual Account SPP (8271-9920-11)', saldo: Math.round(totalKasBank * 0.33) },
    { bank: 'Kas Tunai Bendahara Pesantren', saldo: Math.round(totalKasBank * 0.09) },
  ];

  const resolvedPeriodText = periodLabel || period.toUpperCase();

  const generateReportHtml = () => {
    return `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 10px;">
        <div style="display: flex; align-items: center; border-bottom: 2px solid #064E3B; padding-bottom: 12px; margin-bottom: 16px;">
          <div style="width: 50px; height: 50px; background-color: #064E3B; color: #fff; font-weight: 900; font-size: 26px; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-right: 14px; flex-shrink: 0;">R</div>
          <div style="flex: 1;">
            <h1 style="margin: 0; font-size: 15px; font-weight: 900; color: #064E3B; text-transform: uppercase; letter-spacing: 0.5px;">Pondok Modern Raudhatussalam Mahato</h1>
            <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: bold; color: #334155; text-transform: uppercase;">Laporan Eksekutif & Ringkasan Kinerja Fiskal Pesantren</p>
            <p style="margin: 2px 0 0 0; font-size: 9px; color: #64748b;">Jl. Lintas Mahato KM. 24, Tambusai Utara, Rokan Hulu, Riau 28558 • Telp: (0762) 891234</p>
          </div>
          <div style="text-align: right;">
            <span style="display: inline-block; padding: 4px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 9px; font-weight: bold; font-family: monospace;">RINGKASAN EKSEKUTIF</span>
            <p style="margin: 3px 0 0 0; font-size: 9px; color: #64748b;">Dicetak: ${currentDateFormatted}</p>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 13px; font-weight: 800; text-transform: uppercase; text-decoration: underline; color: #0f172a;">RINGKASAN POSISI KEUANGAN & REALISASI ANGGARAN</h2>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #475569;">Periode: <strong>${resolvedPeriodText}</strong> • Unit: <strong>${unit}</strong> • T.A. 2026/2027</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
          <div>
            <span style="font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Total Pemasukan</span>
            <span style="font-size: 13px; font-weight: 900; color: #064E3B; margin-top: 2px; display: block;">${formatRupiah(totalIncome)}</span>
          </div>
          <div style="border-left: 1px solid #cbd5e1;">
            <span style="font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Total Beban/Pengeluaran</span>
            <span style="font-size: 13px; font-weight: 900; color: #be123c; margin-top: 2px; display: block;">${formatRupiah(totalExpense)}</span>
          </div>
          <div style="border-left: 1px solid #cbd5e1;">
            <span style="font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Surplus Operasional</span>
            <span style="font-size: 13px; font-weight: 900; color: #047857; margin-top: 2px; display: block;">${formatRupiah(totalSurplus)}</span>
          </div>
          <div style="border-left: 1px solid #cbd5e1;">
            <span style="font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Saldo Kas & Bank</span>
            <span style="font-size: 13px; font-weight: 900; color: #1e3a8a; margin-top: 2px; display: block;">${formatRupiah(totalKasBank)}</span>
          </div>
        </div>

        <div style="margin-bottom: 14px;">
          <h3 style="margin: 0 0 6px 0; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #0f172a;">Realisasi Pos Anggaran Utama (RAPBM)</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: #064E3B; color: #ffffff;">
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left;">Pos Anggaran / Pembiayaan</th>
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; width: 130px;">Target Anggaran</th>
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; width: 130px;">Realisasi Aktual</th>
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; width: 90px;">Capaian (%)</th>
              </tr>
            </thead>
            <tbody>
              ${displayBudgetRealization.map((row, idx) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 500;">${row.pos}</td>
                  <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: right; color: #475569;">${formatRupiah(row.anggaran)}</td>
                  <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0f172a;">${formatRupiah(row.realisasi)}</td>
                  <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: #064E3B;">${row.persen}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 6px 0; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #0f172a;">Posisi Rekening & Kas Pesantren</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: #f1f5f9; color: #334155; font-weight: bold;">
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left;">Nama Bank & Nomor Rekening</th>
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; width: 150px;">Saldo Terakhir</th>
              </tr>
            </thead>
            <tbody>
              ${bankBalances.map((b, idx) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${b.bank}</td>
                  <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #064E3B;">${formatRupiah(b.saldo)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 10px;">
          <div style="width: 200px; text-align: center;">
            <p style="margin: 0; color: #64748b;">Mengetahui,</p>
            <p style="margin: 2px 0 45px 0; font-weight: bold; color: #0f172a;">Pimpinan Pondok Modern</p>
            <p style="margin: 0; font-weight: bold; color: #0f172a; text-decoration: underline;">K.H. Rasyid Ridho, Lc., M.A.</p>
            <p style="margin: 2px 0 0 0; font-size: 9px; color: #64748b;">NIP. 19780512 200501 1 002</p>
          </div>
          <div style="width: 200px; text-align: center;">
            <p style="margin: 0; color: #64748b;">Mahato, ${currentDateFormatted}</p>
            <p style="margin: 2px 0 45px 0; font-weight: bold; color: #0f172a;">Bendahara Umum</p>
            <p style="margin: 0; font-weight: bold; color: #0f172a; text-decoration: underline;">H. Ahmad Syarif, M.Pd.</p>
            <p style="margin: 2px 0 0 0; font-size: 9px; color: #64748b;">NIP. 19850914 201101 1 004</p>
          </div>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Direct print blocked in current environment, initiating file export:', err);
      handleExportPdf();
    }
  };

  const handleExportPdf = () => {
    const html = generateReportHtml();
    const safePeriod = resolvedPeriodText.replace(/[^a-zA-Z0-9]/g, '_');
    downloadPrintableReport(
      `Ringkasan_Keuangan_${safePeriod}.html`,
      `Ringkasan Keuangan Pesantren - ${resolvedPeriodText}`,
      html
    );
    setDownloadSuccessToast('Berkas dokumen cetak A4 berhasil diunduh. Buka berkas untuk langsung mencetak atau simpan ke PDF.');
    setTimeout(() => setDownloadSuccessToast(null), 5000);
  };

  const handleExportExcel = () => {
    const safePeriod = resolvedPeriodText.replace(/[^a-zA-Z0-9]/g, '_');
    downloadExcelSpreadsheet(`Ringkasan_Keuangan_${safePeriod}.xls`, {
      title: 'RINGKASAN EKSEKUTIF KEUANGAN & REALISASI ANGGARAN',
      subtitle: `Periode: ${resolvedPeriodText} • Unit: ${unit}`,
      headers: ['Pos Anggaran / Pembiayaan', 'Target Anggaran (Rp)', 'Realisasi Aktual (Rp)', 'Capaian (%)'],
      rows: displayBudgetRealization.map((row) => [
        row.pos,
        formatRupiah(row.anggaran),
        formatRupiah(row.realisasi),
        row.persen,
      ]),
      summary: [
        { label: 'Total Pemasukan', value: formatRupiah(totalIncome) },
        { label: 'Total Beban Pengeluaran', value: formatRupiah(totalExpense) },
        { label: 'Surplus Operasional Bersih', value: formatRupiah(totalSurplus) },
        { label: 'Total Posisi Kas & Bank', value: formatRupiah(totalKasBank) },
      ],
    });
    setDownloadSuccessToast('Laporan ringkasan format Excel (.xls) berhasil diunduh ke komputer Anda.');
    setTimeout(() => setDownloadSuccessToast(null), 5000);
  };

  return (
    <div className="print-modal-backdrop fixed inset-0 z-[75] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        id="print-ringkasan-keuangan-modal"
        className="print-modal-container bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-[#064E3B] text-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Cetak Ringkasan Keuangan
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              id="btn-print-exec-summary-now"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              title="Buka dialog cetak browser (Ctrl+P)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>

            <button
              type="button"
              id="btn-download-pdf-summary"
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition border border-emerald-600 cursor-pointer"
              title="Unduh berkas dokumen resmi siap cetak / simpan sebagai PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF / Dokumen</span>
            </button>

            <button
              type="button"
              id="btn-download-excel-summary"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#064E3B] hover:bg-emerald-50 text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              title="Unduh tabel ringkasan format Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>Excel</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition ml-1"
              title="Tutup Pratinjau"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success toast inside modal if download triggered */}
        {downloadSuccessToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 print:hidden animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}

        {/* Printable Paper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 print:p-0 print:bg-white">
          <div
            id="ringkasan-print-content"
            className="printable-document bg-white border border-slate-200 rounded-xl p-8 shadow-xs max-w-3xl mx-auto text-slate-800 space-y-6 text-xs print:border-none print:shadow-none print:p-0 print:max-w-none"
          >
            {/* Header Pesantren */}
            <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                  R
                </div>
                <div>
                  <h1 className="text-base font-black uppercase tracking-wider text-[#064E3B] leading-tight">
                    Pondok Modern Raudhatussalam Mahato
                  </h1>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Laporan Eksekutif & Ringkasan Kinerja Fiskal Pesantren
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Jl. Lintas Mahato KM. 24, Tambusai Utara, Rokan Hulu, Riau 28558 • (0762) 891234
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-slate-100 rounded text-[11px] font-mono font-bold text-slate-700 border border-slate-200">
                  RINGKASAN EKSEKUTIF
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Dicetak: {currentDateFormatted}
                </p>
              </div>
            </div>

            {/* Document Title & Meta */}
            <div className="text-center space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 underline underline-offset-4">
                RINGKASAN POSISI KEUANGAN & REALISASI ANGGARAN
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Periode: <strong>{resolvedPeriodText}</strong> • Unit: <strong>{unit}</strong> • T.A. 2026/2027
              </p>
            </div>

            {/* Executive KPIs */}
            <div className="grid grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center avoid-break">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Pemasukan</span>
                <span className="text-sm font-black text-[#064E3B] mt-0.5 block">{formatRupiah(totalIncome)}</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Pengeluaran</span>
                <span className="text-sm font-black text-rose-700 mt-0.5 block">{formatRupiah(totalExpense)}</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Surplus Operasional</span>
                <span className="text-sm font-black text-emerald-800 mt-0.5 block">{formatRupiah(totalSurplus)}</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Saldo Kas & Bank</span>
                <span className="text-sm font-black text-blue-900 mt-0.5 block">{formatRupiah(totalKasBank)}</span>
              </div>
            </div>

            {/* Budget vs Actual Realization Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Realisasi Pos Anggaran Utama
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="p-2.5">Pos Anggaran / Pembiayaan</th>
                      <th className="p-2.5 w-32 text-right">Target Anggaran</th>
                      <th className="p-2.5 w-32 text-right">Realisasi Aktual</th>
                      <th className="p-2.5 w-24 text-center">Capaian (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {displayBudgetRealization.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-2.5 font-medium text-slate-900">{row.pos}</td>
                        <td className="p-2.5 text-right font-semibold text-slate-600">{formatRupiah(row.anggaran)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-800">{formatRupiah(row.realisasi)}</td>
                        <td className="p-2.5 text-center font-bold text-[#064E3B]">{row.persen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bank Positions */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Posisi Rekening & Kas Pesantren
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="p-2.5">Nama Bank & Nomor Rekening</th>
                      <th className="p-2.5 w-36 text-right">Saldo Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {bankBalances.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-2.5 font-medium text-slate-800">{b.bank}</td>
                        <td className="p-2.5 text-right font-bold text-[#064E3B]">{formatRupiah(b.saldo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures */}
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
                  <p className="font-bold text-slate-800">Bendahara Umum</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">H. Ahmad Syarif, M.Pd.</p>
                  <p className="text-[10px] text-slate-500">NIP. 19850914 201101 1 004</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
