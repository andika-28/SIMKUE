import React from 'react';
import { Printer, X, CheckCircle2, Building, ShieldCheck, Download } from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { downloadPrintableReport } from '../../utils/fileDownloader';
import { ReportPeriodType } from '../../types';
import {
  bankPositionReports,
  arrearsSummaryStats,
  getFinancialSummary,
  getIncomeBreakdown,
  getExpenseBreakdown,
} from '../../data/reportData';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  periodText: string;
  periodType?: ReportPeriodType | string;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  periodText,
  periodType = 'bulan_ini',
}) => {
  if (!isOpen) return null;

  const validPeriodType: ReportPeriodType = (
    ['hari_ini', 'minggu_ini', 'bulan_ini', 'semester_ini', 'tahun_ini', 'custom'].includes(periodType)
      ? periodType
      : 'bulan_ini'
  ) as ReportPeriodType;

  const currentSummary = getFinancialSummary(validPeriodType);
  const currentIncome = getIncomeBreakdown(validPeriodType);
  const currentExpenses = getExpenseBreakdown(validPeriodType);

  const isPemasukanOnly = reportTitle.toLowerCase().includes('pemasukan');
  const isPengeluaranOnly = reportTitle.toLowerCase().includes('pengeluaran');

  const totalIncomeAmount = currentIncome.reduce((s, i) => s + i.totalNominal, 0);
  const totalIncomeTransactions = currentIncome.reduce((s, i) => s + i.transactionCount, 0);
  const avgIncomePerTrx = totalIncomeTransactions > 0 ? Math.round(totalIncomeAmount / totalIncomeTransactions) : 0;
  const topIncomeSource = currentIncome.length > 0
    ? [...currentIncome].sort((a, b) => b.totalNominal - a.totalNominal)[0]
    : null;

  const totalExpenseAmount = currentExpenses.reduce((s, i) => s + i.totalNominal, 0);
  const totalExpenseTransactions = currentExpenses.reduce((s, i) => s + i.transactionCount, 0);
  const avgExpensePerTrx = totalExpenseTransactions > 0 ? Math.round(totalExpenseAmount / totalExpenseTransactions) : 0;
  const topExpenseCategory = currentExpenses.length > 0
    ? [...currentExpenses].sort((a, b) => b.totalNominal - a.totalNominal)[0]
    : null;

  const handleDownloadPdf = () => {
    const filename = `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_resmi.html`;
    
    // HTML Content conditionally rendered based on report type
    let kpiCardsHtml = '';
    let tablesContentHtml = '';

    if (isPemasukanOnly) {
      kpiCardsHtml = `
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px;">
          <div style="padding:8px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#064E3B;font-weight:bold;">TOTAL PENERIMAAN</div>
            <div style="font-size:12px;font-weight:bold;color:#064E3B;margin-top:2px;">${formatRupiah(totalIncomeAmount)}</div>
          </div>
          <div style="padding:8px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#64748b;font-weight:bold;">VOLUME TRANSAKSI</div>
            <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${totalIncomeTransactions} Transaksi</div>
          </div>
          <div style="padding:8px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#64748b;font-weight:bold;">RATA-RATA / TRANSAKSI</div>
            <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${formatRupiah(avgIncomePerTrx)}</div>
          </div>
          <div style="padding:8px;background:#064E3B;border:1px solid #064E3B;border-radius:6px;text-align:center;color:#ffffff;">
            <div style="font-size:9px;color:#a7f3d0;font-weight:bold;">SUMBER TERBESAR</div>
            <div style="font-size:11px;font-weight:900;color:#ffffff;margin-top:2px;">${topIncomeSource?.source || 'SPP Santri'}</div>
          </div>
        </div>
      `;

      tablesContentHtml = `
        <div style="margin-bottom:20px;">
          <h3 style="font-size:11px;font-weight:bold;color:#064E3B;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin:0 0 6px 0;text-transform:uppercase;">
            Rincian Sumber Penerimaan Pemasukan Pesantren
          </h3>
          <table style="width:100%;border-collapse:collapse;font-size:10px;">
            <thead>
              <tr style="border-bottom:1px solid #cbd5e1;color:#64748b;text-align:left;background:#f8fafc;">
                <th style="padding:6px 4px;width:30px;">No</th>
                <th style="padding:6px 4px;">Sumber Pemasukan</th>
                <th style="padding:6px 4px;">Alokasi Unit</th>
                <th style="padding:6px 4px;text-align:center;">Jumlah Trx</th>
                <th style="padding:6px 4px;text-align:right;">Porsi (%)</th>
                <th style="padding:6px 4px;text-align:right;">Total Nominal</th>
              </tr>
            </thead>
            <tbody>
              ${currentIncome
                .map(
                  (item, idx) => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:5px 4px;">${idx + 1}</td>
                  <td style="padding:5px 4px;font-weight:bold;color:#1e293b;">${item.source}</td>
                  <td style="padding:5px 4px;color:#64748b;">${item.unit}</td>
                  <td style="padding:5px 4px;text-align:center;color:#334155;">${item.transactionCount}</td>
                  <td style="padding:5px 4px;text-align:right;color:#64748b;">${item.percentage.toFixed(1)}%</td>
                  <td style="padding:5px 4px;text-align:right;font-weight:bold;color:#064E3B;">${formatRupiah(item.totalNominal)}</td>
                </tr>`
                )
                .join('')}
            </tbody>
            <tfoot>
              <tr style="border-top:2px solid #064E3B;background:#ecfdf5;font-weight:bold;">
                <td colspan="5" style="padding:6px 4px;text-align:right;text-transform:uppercase;color:#064E3B;">TOTAL PENERIMAAN:</td>
                <td style="padding:6px 4px;text-align:right;font-size:11px;font-weight:900;color:#064E3B;">${formatRupiah(totalIncomeAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    } else if (isPengeluaranOnly) {
      kpiCardsHtml = `
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px;">
          <div style="padding:8px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#991b1b;font-weight:bold;">TOTAL REALISASI BELANJA</div>
            <div style="font-size:12px;font-weight:bold;color:#991b1b;margin-top:2px;">${formatRupiah(totalExpenseAmount)}</div>
          </div>
          <div style="padding:8px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#64748b;font-weight:bold;">VOLUME TRANSAKSI</div>
            <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${totalExpenseTransactions} Transaksi</div>
          </div>
          <div style="padding:8px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#64748b;font-weight:bold;">RATA-RATA / TRANSAKSI</div>
            <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${formatRupiah(avgExpensePerTrx)}</div>
          </div>
          <div style="padding:8px;background:#78350f;border:1px solid #78350f;border-radius:6px;text-align:center;color:#ffffff;">
            <div style="font-size:9px;color:#fde68a;font-weight:bold;">BEBAN TERBESAR</div>
            <div style="font-size:11px;font-weight:900;color:#ffffff;margin-top:2px;">${topExpenseCategory?.category || 'Dapur & Konsumsi'}</div>
          </div>
        </div>
      `;

      tablesContentHtml = `
        <div style="margin-bottom:20px;">
          <h3 style="font-size:11px;font-weight:bold;color:#064E3B;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin:0 0 6px 0;text-transform:uppercase;">
            Rincian Realisasi Belanja & Pengeluaran Pesantren
          </h3>
          <table style="width:100%;border-collapse:collapse;font-size:10px;">
            <thead>
              <tr style="border-bottom:1px solid #cbd5e1;color:#64748b;text-align:left;background:#f8fafc;">
                <th style="padding:6px 4px;width:25px;">No</th>
                <th style="padding:6px 4px;">Kategori Pengeluaran</th>
                <th style="padding:6px 4px;">Sumber Keuangan (Dana)</th>
                <th style="padding:6px 4px;">Alokasi Unit</th>
                <th style="padding:6px 4px;text-align:center;">Jumlah Trx</th>
                <th style="padding:6px 4px;text-align:right;">Porsi (%)</th>
                <th style="padding:6px 4px;text-align:right;">Total Nominal</th>
              </tr>
            </thead>
            <tbody>
              ${currentExpenses
                .map(
                  (item, idx) => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:5px 4px;">${idx + 1}</td>
                  <td style="padding:5px 4px;font-weight:bold;color:#1e293b;">${item.category}</td>
                  <td style="padding:5px 4px;">
                    <span style="font-weight:bold;color:#064E3B;background:#ecfdf5;border:1px solid #a7f3d0;padding:1px 5px;border-radius:4px;font-size:9px;">
                      ${item.sumberKeuangan || 'Kas Operasional'}
                    </span>
                    ${item.akunKas ? `<div style="font-size:8px;color:#64748b;margin-top:1px;">${item.akunKas}</div>` : ''}
                  </td>
                  <td style="padding:5px 4px;color:#64748b;">${item.unit}</td>
                  <td style="padding:5px 4px;text-align:center;color:#334155;">${item.transactionCount}</td>
                  <td style="padding:5px 4px;text-align:right;color:#64748b;">${item.percentage.toFixed(1)}%</td>
                  <td style="padding:5px 4px;text-align:right;font-weight:bold;color:#991b1b;">${formatRupiah(item.totalNominal)}</td>
                </tr>`
                )
                .join('')}
            </tbody>
            <tfoot>
              <tr style="border-top:2px solid #991b1b;background:#fef2f2;font-weight:bold;">
                <td colspan="6" style="padding:6px 4px;text-align:right;text-transform:uppercase;color:#991b1b;">TOTAL REALISASI BELANJA:</td>
                <td style="padding:6px 4px;text-align:right;font-size:11px;font-weight:900;color:#991b1b;">${formatRupiah(totalExpenseAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    } else {
      kpiCardsHtml = `
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px;">
          <div style="padding:8px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#64748b;font-weight:bold;">SALDO AWAL</div>
            <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${formatRupiah(currentSummary.saldoAwal)}</div>
          </div>
          <div style="padding:8px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#064E3B;font-weight:bold;">(+) TOTAL PEMASUKAN</div>
            <div style="font-size:12px;font-weight:bold;color:#064E3B;margin-top:2px;">${formatRupiah(currentSummary.totalPemasukan)}</div>
          </div>
          <div style="padding:8px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;text-align:center;">
            <div style="font-size:9px;color:#991b1b;font-weight:bold;">(-) TOTAL PENGELUARAN</div>
            <div style="font-size:12px;font-weight:bold;color:#991b1b;margin-top:2px;">${formatRupiah(currentSummary.totalPengeluaran)}</div>
          </div>
          <div style="padding:8px;background:#064E3B;border:1px solid #064E3B;border-radius:6px;text-align:center;color:#ffffff;">
            <div style="font-size:9px;color:#a7f3d0;font-weight:bold;">(=) SALDO AKHIR</div>
            <div style="font-size:12px;font-weight:900;color:#ffffff;margin-top:2px;">${formatRupiah(currentSummary.saldoAkhir)}</div>
          </div>
        </div>
      `;

      tablesContentHtml = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">
          <div>
            <h3 style="font-size:11px;font-weight:bold;color:#064E3B;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin:0 0 6px 0;text-transform:uppercase;">1. Rincian Pemasukan</h3>
            <table style="width:100%;border-collapse:collapse;font-size:10px;">
              <thead>
                <tr style="border-bottom:1px solid #cbd5e1;color:#64748b;text-align:left;">
                  <th style="padding:4px 0;">Sumber</th>
                  <th style="padding:4px 0;text-align:right;">Nominal</th>
                </tr>
              </thead>
              <tbody>
                ${currentIncome
                  .map(
                    (item) => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:4px 0;">${item.source}</td>
                    <td style="padding:4px 0;text-align:right;font-weight:bold;color:#064E3B;">${formatRupiah(item.totalNominal)}</td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          <div>
            <h3 style="font-size:11px;font-weight:bold;color:#064E3B;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin:0 0 6px 0;text-transform:uppercase;">2. Rincian Pengeluaran</h3>
            <table style="width:100%;border-collapse:collapse;font-size:10px;">
              <thead>
                <tr style="border-bottom:1px solid #cbd5e1;color:#64748b;text-align:left;">
                  <th style="padding:4px 0;">Kategori</th>
                  <th style="padding:4px 0;text-align:right;">Nominal</th>
                </tr>
              </thead>
              <tbody>
                ${currentExpenses
                  .map(
                    (item) => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:4px 0;">${item.category}</td>
                    <td style="padding:4px 0;text-align:right;font-weight:bold;color:#991b1b;">${formatRupiah(item.totalNominal)}</td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    const printableHtml = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.4; padding: 12px;">
        <div style="display:flex;align-items:center;border-bottom:3px double #064E3B;padding-bottom:12px;margin-bottom:16px;">
          <div style="width:55px;height:55px;border-radius:12px;background:#064E3B;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;margin-right:14px;">
            R
          </div>
          <div style="flex:1;">
            <h1 style="margin:0;font-size:16px;text-transform:uppercase;color:#064E3B;font-weight:900;">
              Pondok Modern Raudhatussalam Mahato
            </h1>
            <p style="margin:2px 0 0 0;font-size:11px;font-weight:bold;color:#334155;text-transform:uppercase;">
              Sistem Informasi Manajemen Keuangan (SIMKEU) Pesantren
            </p>
            <p style="margin:2px 0 0 0;font-size:10px;color:#64748b;">
              Jl. Lintas Mahato KM. 24, Tambusai Utara, Rokan Hulu, Riau 28558 • Telp: (0762) 891234
            </p>
          </div>
          <div style="text-align:right;">
            <span style="background:#ecfdf5;border:1px solid #a7f3d0;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:bold;color:#064E3B;">DOKUMEN RESMI</span>
            <p style="margin:4px 0 0 0;font-size:10px;color:#64748b;">Dicetak: 01 September 2026</p>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:16px;">
          <h2 style="margin:0;font-size:14px;text-transform:uppercase;text-decoration:underline;font-weight:bold;">${reportTitle}</h2>
          <p style="margin:4px 0 0 0;font-size:11px;color:#475569;">Periode: <strong>${periodText}</strong> • Tahun Ajaran 2026/2027</p>
        </div>

        ${kpiCardsHtml}

        ${tablesContentHtml}

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;text-align:center;font-size:11px;margin-top:24px;page-break-inside:avoid;">
          <div>
            <p style="margin:0;color:#64748b;">Mengetahui,</p>
            <p style="margin:2px 0 50px 0;font-weight:bold;">Pimpinan Pondok Modern</p>
            <p style="margin:0;font-weight:bold;text-decoration:underline;">K.H. Rasyid Ridho, Lc., M.A.</p>
            <p style="margin:2px 0 0 0;font-size:10px;color:#64748b;">NIP. 19780512 200501 1 002</p>
          </div>
          <div>
            <p style="margin:0;color:#64748b;">Mahato, 01 September 2026</p>
            <p style="margin:2px 0 50px 0;font-weight:bold;">Bendahara Pesantren</p>
            <p style="margin:0;font-weight:bold;text-decoration:underline;">H. Ahmad Syarif, M.Pd.</p>
            <p style="margin:2px 0 0 0;font-size:10px;color:#64748b;">NIP. 19850914 201101 1 004</p>
          </div>
        </div>
      </div>
    `;

    downloadPrintableReport(filename, reportTitle, printableHtml);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadPdf();
    }
  };

  return (
    <div
      id="print-report-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="print-report-modal"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-[#1E293B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Cetak Dokumen Resmi
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-trigger-download-pdf-report"
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-[#064E3B] text-xs font-bold rounded-lg shadow-xs transition"
              title="Unduh berkas dokumen siap cetak / simpan sebagai PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unduh Dokumen / PDF</span>
            </button>
            <button
              type="button"
              id="btn-trigger-browser-print"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#064E3B] hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Sekarang
            </button>
            <button
              type="button"
              id="btn-close-print-preview"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div
            id="printable-document-content"
            className="bg-white border border-[#CBD5E1] rounded-lg p-8 shadow-xs max-w-3xl mx-auto text-[#1E293B] space-y-6 text-xs print:border-none print:shadow-none print:p-0"
          >
            {/* Header Pesantren */}
            <div className="border-b-2 border-[#1E293B] pb-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                R
              </div>
              <div className="flex-1 text-center pr-12">
                <h1 className="text-base font-black uppercase tracking-wider text-[#064E3B]">
                  Pondok Modern Raudhatussalam Mahato
                </h1>
                <p className="text-[11px] font-bold text-[#334155] uppercase tracking-wide">
                  Sistem Informasi Manajemen Keuangan (SIMKEU)
                </p>
                <p className="text-[10px] text-[#64748B] mt-0.5">
                  Jl. Lintas Mahato KM. 24, Tambusai Utara, Rokan Hulu, Riau 28558 • Telp: (0762) 891234
                </p>
              </div>
            </div>

            {/* Document Title & Meta */}
            <div className="text-center space-y-1">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1E293B] underline underline-offset-4">
                {reportTitle}
              </h2>
              <p className="text-[11px] font-medium text-[#64748B]">
                Periode: <strong className="text-[#1E293B]">{periodText}</strong>
              </p>
              <div className="flex items-center justify-center gap-4 text-[10px] text-[#64748B] pt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Status Data: Terverifikasi Sistem
                </span>
                <span>•</span>
                <span>Tahun Ajaran: 2026 / 2027</span>
                <span>•</span>
                <span>Dicetak: 01 September 2026, 14:35 WIB</span>
              </div>
            </div>

            {/* Financial Summary Statement Formula or Category-Specific KPI */}
            {isPemasukanOnly ? (
              <div className="grid grid-cols-4 gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-center">
                <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                  <div className="text-[10px] text-emerald-700 font-semibold uppercase">
                    Total Penerimaan
                  </div>
                  <div className="text-xs font-bold text-emerald-800 mt-0.5">
                    {formatRupiah(totalIncomeAmount)}
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Volume Transaksi</div>
                  <div className="text-xs font-bold text-[#1E293B] mt-0.5">
                    {totalIncomeTransactions} Transaksi
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Rata-Rata / Trx</div>
                  <div className="text-xs font-bold text-[#1E293B] mt-0.5">
                    {formatRupiah(avgIncomePerTrx)}
                  </div>
                </div>
                <div className="p-2 bg-[#064E3B] text-white rounded shadow-xs">
                  <div className="text-[10px] text-emerald-200 font-semibold uppercase">
                    Sumber Terbesar
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5 truncate">
                    {topIncomeSource?.source || 'SPP Santri'}
                  </div>
                </div>
              </div>
            ) : isPengeluaranOnly ? (
              <div className="grid grid-cols-4 gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-center">
                <div className="p-2 bg-red-50 rounded border border-red-200">
                  <div className="text-[10px] text-red-700 font-semibold uppercase">
                    Total Pengeluaran
                  </div>
                  <div className="text-xs font-bold text-red-800 mt-0.5">
                    {formatRupiah(totalExpenseAmount)}
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Volume Transaksi</div>
                  <div className="text-xs font-bold text-[#1E293B] mt-0.5">
                    {totalExpenseTransactions} Transaksi
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Rata-Rata / Trx</div>
                  <div className="text-xs font-bold text-[#1E293B] mt-0.5">
                    {formatRupiah(avgExpensePerTrx)}
                  </div>
                </div>
                <div className="p-2 bg-[#78350F] text-white rounded shadow-xs">
                  <div className="text-[10px] text-amber-200 font-semibold uppercase">
                    Beban Terbesar
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5 truncate">
                    {topExpenseCategory?.category || 'Dapur & Konsumsi'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-center">
                <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Saldo Awal</div>
                  <div className="text-xs font-bold text-[#1E293B] mt-0.5">
                    {formatRupiah(currentSummary.saldoAwal)}
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                  <div className="text-[10px] text-emerald-700 font-semibold uppercase">
                    (+) Total Pemasukan
                  </div>
                  <div className="text-xs font-bold text-emerald-800 mt-0.5">
                    {formatRupiah(currentSummary.totalPemasukan)}
                  </div>
                </div>
                <div className="p-2 bg-amber-50 rounded border border-amber-200">
                  <div className="text-[10px] text-amber-700 font-semibold uppercase">
                    (-) Total Pengeluaran
                  </div>
                  <div className="text-xs font-bold text-amber-800 mt-0.5">
                    {formatRupiah(currentSummary.totalPengeluaran)}
                  </div>
                </div>
                <div className="p-2 bg-[#064E3B] text-white rounded shadow-xs">
                  <div className="text-[10px] text-emerald-200 font-semibold uppercase">
                    (=) Saldo Akhir
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {formatRupiah(currentSummary.saldoAkhir)}
                  </div>
                </div>
              </div>
            )}

            {/* Tables Section: Pemasukan & Pengeluaran */}
            {isPemasukanOnly ? (
              <div className="pt-2">
                <h3 className="font-bold text-[#064E3B] text-[11px] mb-1.5 uppercase tracking-wide border-b border-[#CBD5E1] pb-1">
                  Rincian Sumber Penerimaan Pemasukan
                </h3>
                <table className="w-full text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#CBD5E1] text-[#64748B] text-left bg-slate-50">
                      <th className="py-1.5 px-2 w-8">No</th>
                      <th className="py-1.5 px-2">Sumber Penerimaan</th>
                      <th className="py-1.5 px-2">Alokasi Unit</th>
                      <th className="py-1.5 px-2 text-center">Volume Trx</th>
                      <th className="py-1.5 px-2 text-right">Porsi (%)</th>
                      <th className="py-1.5 px-2 text-right">Total Realisasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentIncome.map((item, idx) => (
                      <tr key={item.no} className="hover:bg-slate-50/50">
                        <td className="py-1.5 px-2 text-[#64748B]">{idx + 1}</td>
                        <td className="py-1.5 px-2 font-bold text-[#1E293B]">{item.source}</td>
                        <td className="py-1.5 px-2 text-[#64748B]">{item.unit}</td>
                        <td className="py-1.5 px-2 text-center text-[#64748B]">{item.transactionCount}</td>
                        <td className="py-1.5 px-2 text-right text-[#64748B]">{item.percentage.toFixed(1)}%</td>
                        <td className="py-1.5 px-2 text-right font-bold text-emerald-800">
                          {formatRupiah(item.totalNominal)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-[#064E3B] font-bold bg-emerald-50/60">
                      <td className="py-2 px-2" colSpan={5}>
                        TOTAL PENERIMAAN PEMASUKAN
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-900 font-black text-xs">
                        {formatRupiah(totalIncomeAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : isPengeluaranOnly ? (
              <div className="pt-2">
                <h3 className="font-bold text-[#991B1B] text-[11px] mb-1.5 uppercase tracking-wide border-b border-[#CBD5E1] pb-1">
                  Rincian Pos Realisasi Belanja & Pengeluaran
                </h3>
                <table className="w-full text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#CBD5E1] text-[#64748B] text-left bg-slate-50">
                      <th className="py-1.5 px-2 w-8">No</th>
                      <th className="py-1.5 px-2">Kategori Pengeluaran</th>
                      <th className="py-1.5 px-2">Alokasi Unit</th>
                      <th className="py-1.5 px-2 text-center">Volume Trx</th>
                      <th className="py-1.5 px-2 text-right">Porsi (%)</th>
                      <th className="py-1.5 px-2 text-right">Total Realisasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentExpenses.map((item, idx) => (
                      <tr key={item.no} className="hover:bg-slate-50/50">
                        <td className="py-1.5 px-2 text-[#64748B]">{idx + 1}</td>
                        <td className="py-1.5 px-2 font-bold text-[#1E293B]">{item.category}</td>
                        <td className="py-1.5 px-2 text-[#64748B]">{item.unit}</td>
                        <td className="py-1.5 px-2 text-center text-[#64748B]">{item.transactionCount}</td>
                        <td className="py-1.5 px-2 text-right text-[#64748B]">{item.percentage.toFixed(1)}%</td>
                        <td className="py-1.5 px-2 text-right font-bold text-red-800">
                          {formatRupiah(item.totalNominal)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-[#991B1B] font-bold bg-red-50/60">
                      <td className="py-2 px-2" colSpan={5}>
                        TOTAL REALISASI PENGELUARAN
                      </td>
                      <td className="py-2 px-2 text-right text-red-900 font-black text-xs">
                        {formatRupiah(totalExpenseAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Income Summary */}
                <div>
                  <h3 className="font-bold text-[#064E3B] text-[11px] mb-1.5 uppercase tracking-wide border-b border-[#CBD5E1] pb-1">
                    1. Ringkasan Pemasukan
                  </h3>
                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#CBD5E1] text-[#64748B] text-left">
                        <th className="py-1">Sumber</th>
                        <th className="py-1 text-center">Trx</th>
                        <th className="py-1 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentIncome.map((item) => (
                        <tr key={item.no}>
                          <td className="py-1 font-medium">{item.source}</td>
                          <td className="py-1 text-center text-[#64748B]">{item.transactionCount}</td>
                          <td className="py-1 text-right font-semibold">
                            {formatRupiah(item.totalNominal)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-[#1E293B] font-bold bg-slate-50">
                        <td className="py-1" colSpan={2}>
                          TOTAL PEMASUKAN
                        </td>
                        <td className="py-1 text-right text-emerald-800 font-extrabold">
                          {formatRupiah(currentSummary.totalPemasukan)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Expense Summary */}
                <div>
                  <h3 className="font-bold text-[#064E3B] text-[11px] mb-1.5 uppercase tracking-wide border-b border-[#CBD5E1] pb-1">
                    2. Ringkasan Pengeluaran
                  </h3>
                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#CBD5E1] text-[#64748B] text-left">
                        <th className="py-1">Kategori</th>
                        <th className="py-1 text-center">Trx</th>
                        <th className="py-1 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentExpenses.slice(0, 6).map((item) => (
                        <tr key={item.no}>
                          <td className="py-1 font-medium">{item.category}</td>
                          <td className="py-1 text-center text-[#64748B]">{item.transactionCount}</td>
                          <td className="py-1 text-right font-semibold">
                            {formatRupiah(item.totalNominal)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-[#1E293B] font-bold bg-slate-50">
                        <td className="py-1" colSpan={2}>
                          TOTAL PENGELUARAN
                        </td>
                        <td className="py-1 text-right text-amber-800 font-extrabold">
                          {formatRupiah(currentSummary.totalPengeluaran)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bank Positions */}
            <div className="pt-2">
              <h3 className="font-bold text-[#064E3B] text-[11px] mb-1.5 uppercase tracking-wide border-b border-[#CBD5E1] pb-1">
                {isPemasukanOnly
                  ? 'Posisi Penerimaan Rekening Kasir & Bank'
                  : isPengeluaranOnly
                  ? 'Posisi Pengeluaran Rekening Kasir & Bank'
                  : 'Posisi Saldo Rekening Bank (BNI)'}
              </h3>
              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-[#CBD5E1] text-[#64748B] text-left bg-slate-50">
                    <th className="py-1 px-2">Nama Rekening</th>
                    <th className="py-1 text-right">Saldo Awal</th>
                    {!isPengeluaranOnly && <th className="py-1 text-right">Pemasukan</th>}
                    {!isPemasukanOnly && <th className="py-1 text-right">Pengeluaran</th>}
                    <th className="py-1 px-2 text-right">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bankPositionReports.map((bank, i) => (
                    <tr key={i}>
                      <td className="py-1 px-2 font-medium">{bank.rekeningName}</td>
                      <td className="py-1 text-right text-[#64748B]">
                        {formatRupiah(bank.saldoAwal)}
                      </td>
                      {!isPengeluaranOnly && (
                        <td className="py-1 text-right text-emerald-700">
                          {formatRupiah(bank.pemasukan)}
                        </td>
                      )}
                      {!isPemasukanOnly && (
                        <td className="py-1 text-right text-amber-700">
                          {formatRupiah(bank.pengeluaran)}
                        </td>
                      )}
                      <td className="py-1 px-2 text-right font-bold text-[#1E293B]">
                        {formatRupiah(bank.saldoAkhir)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#1E293B] font-bold bg-emerald-50/50">
                    <td className="py-1.5 px-2">TOTAL KONSOLIDASI</td>
                    <td className="py-1.5 text-right">{formatRupiah(currentSummary.saldoAwal)}</td>
                    {!isPengeluaranOnly && (
                      <td className="py-1.5 text-right text-emerald-800">
                        {formatRupiah(currentSummary.totalPemasukan)}
                      </td>
                    )}
                    {!isPemasukanOnly && (
                      <td className="py-1.5 text-right text-amber-800">
                        {formatRupiah(currentSummary.totalPengeluaran)}
                      </td>
                    )}
                    <td className="py-1.5 px-2 text-right text-[#064E3B] font-black">
                      {formatRupiah(currentSummary.saldoAkhir)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-[10px]">
              <div>
                <p className="text-[#64748B]">Mengetahui,</p>
                <p className="font-bold text-[#1E293B]">Pimpinan Pesantren</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[9px] text-[#94A3B8] italic">(Tanda tangan & Stempel)</span>
                </div>
                <p className="font-bold text-[#1E293B] underline">
                  KH. Muhammad Zainuddin, Lc., M.Pd
                </p>
                <p className="text-[9px] text-[#64748B]">NIP: 19780512 200312 1 002</p>
              </div>

              <div>
                <p className="text-[#64748B]">Rokan Hulu, 01 September 2026</p>
                <p className="font-bold text-[#1E293B]">Bendahara Keuangan Pesantren</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[9px] text-[#94A3B8] italic">(Tanda tangan & Stempel)</span>
                </div>
                <p className="font-bold text-[#1E293B] underline">Ust. Ahmad Fauzi, S.E.I</p>
                <p className="text-[9px] text-[#64748B]">NIP: 19850320 200904 1 003</p>
              </div>
            </div>

            {/* Official Footer */}
            <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-[9px] text-[#94A3B8]">
              <div>
                Dicetak pada: <strong>01 September 2026, 14:35 WIB</strong>
              </div>
              <div>Generated by: SIMKEU PM. RAUDHATUSSALAM MAHATO</div>
              <div>Halaman 1 / 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
