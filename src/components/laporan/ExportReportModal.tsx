import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, Check, Download, Loader2, Sparkles } from 'lucide-react';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';
import {
  getFinancialSummary,
  getIncomeBreakdown,
  getExpenseBreakdown,
  initialIncomeBreakdown,
  initialExpenseBreakdown,
} from '../../data/reportData';
import { formatRupiah } from '../../data/initialData';
import { ReportPeriodType } from '../../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  periodText: string;
  periodType?: ReportPeriodType | string;
  defaultFormat?: 'PDF' | 'Excel';
  onExportSuccess: (format: 'PDF' | 'Excel', filename: string) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  periodText,
  periodType = 'bulan_ini',
  defaultFormat = 'PDF',
  onExportSuccess,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'Excel'>(defaultFormat);

  React.useEffect(() => {
    if (isOpen && defaultFormat) {
      setSelectedFormat(defaultFormat);
    }
  }, [isOpen, defaultFormat]);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAuditLog, setIncludeAuditLog] = useState(false);
  const [paperOrientation, setPaperOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const validPeriodType: ReportPeriodType = (
    ['hari_ini', 'minggu_ini', 'bulan_ini', 'semester_ini', 'tahun_ini', 'custom'].includes(periodType || '')
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

  const totalExpenseAmount = currentExpenses.reduce((s, i) => s + i.totalNominal, 0);
  const totalExpenseTransactions = currentExpenses.reduce((s, i) => s + i.transactionCount, 0);
  const avgExpensePerTrx = totalExpenseTransactions > 0 ? Math.round(totalExpenseAmount / totalExpenseTransactions) : 0;

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgressPercent(15);

    const step1 = setTimeout(() => setProgressPercent(45), 300);
    const step2 = setTimeout(() => setProgressPercent(80), 700);
    const step3 = setTimeout(() => {
      setProgressPercent(100);
      setIsGenerating(false);

      const ext = selectedFormat === 'PDF' ? 'html' : 'xls';
      const cleanTitle = reportTitle.toLowerCase().replace(/\s+/g, '_');
      const filename = `${cleanTitle}_agustus_2026.${ext}`;

      // Trigger REAL File Download to the user's computer/phone
      if (selectedFormat === 'Excel') {
        if (isPemasukanOnly) {
          // Dedicated Income Spreadsheet
          const headers = ['No', 'Sumber Penerimaan Pemasukan', 'Alokasi Unit', 'Jumlah Transaksi', 'Total Nominal Realisasi', 'Porsi (%)'];
          const rows = currentIncome.map((inc, i) => [
            i + 1,
            inc.source,
            inc.unit,
            inc.transactionCount,
            formatRupiah(inc.totalNominal),
            `${inc.percentage.toFixed(1)}%`,
          ]);

          downloadExcelSpreadsheet(filename, {
            title: reportTitle.toUpperCase(),
            subtitle: `Periode: ${periodText} • SIMKEU Pondok Modern Raudhatussalam Mahato`,
            headers,
            rows,
            summary: [
              { label: 'Total Penerimaan Terdata', value: formatRupiah(totalIncomeAmount) },
              { label: 'Total Volume Transaksi', value: `${totalIncomeTransactions} Transaksi` },
              { label: 'Rata-rata Penerimaan / Transaksi', value: formatRupiah(avgIncomePerTrx) },
            ]
          });
        } else if (isPengeluaranOnly) {
          // Dedicated Expense Spreadsheet with Sumber Keuangan
          const headers = ['No', 'Kategori Pos Pengeluaran', 'Sumber Keuangan (Dana)', 'Akun / Rekening Kas', 'Alokasi Unit', 'Jumlah Transaksi', 'Total Realisasi Beban', 'Porsi (%)'];
          const rows = currentExpenses.map((exp, j) => [
            j + 1,
            exp.category,
            exp.sumberKeuangan || 'Kas Operasional Pesantren',
            exp.akunKas || 'BNI Rekening Pesantren',
            exp.unit,
            exp.transactionCount,
            formatRupiah(exp.totalNominal),
            `${exp.percentage.toFixed(1)}%`,
          ]);

          downloadExcelSpreadsheet(filename, {
            title: reportTitle.toUpperCase(),
            subtitle: `Periode: ${periodText} • SIMKEU Pondok Modern Raudhatussalam Mahato`,
            headers,
            rows,
            summary: [
              { label: 'Total Realisasi Belanja', value: formatRupiah(totalExpenseAmount) },
              { label: 'Total Volume Transaksi', value: `${totalExpenseTransactions} Transaksi` },
              { label: 'Rata-rata Pengeluaran / Transaksi', value: formatRupiah(avgExpensePerTrx) },
            ]
          });
        } else {
          // Consolidated Spreadsheet
          const headers = ['No', 'Komponen / Kategori Pos', 'Tipe', 'Sumber Keuangan / Penerimaan', 'Unit', 'Jml Transaksi', 'Total Realisasi', 'Porsi (%)'];
          const rows = [
            ...currentIncome.map((inc, i) => [
              i + 1,
              inc.source,
              'Penerimaan',
              inc.source,
              inc.unit,
              inc.transactionCount,
              formatRupiah(inc.totalNominal),
              `${inc.percentage.toFixed(1)}%`,
            ]),
            ...currentExpenses.map((exp, j) => [
              currentIncome.length + j + 1,
              exp.category,
              'Pengeluaran',
              exp.sumberKeuangan || 'Kas Operasional Pesantren',
              exp.unit,
              exp.transactionCount,
              formatRupiah(exp.totalNominal),
              `${exp.percentage.toFixed(1)}%`,
            ])
          ];

          downloadExcelSpreadsheet(filename, {
            title: reportTitle.toUpperCase(),
            subtitle: `Periode: ${periodText} • SIMKEU Pondok Modern Raudhatussalam Mahato`,
            headers,
            rows,
            summary: [
              { label: 'Total Penerimaan Terdata', value: formatRupiah(totalIncomeAmount) },
              { label: 'Total Pengeluaran Terdata', value: formatRupiah(totalExpenseAmount) },
              { label: 'Surplus Fiskal Bersih', value: formatRupiah(totalIncomeAmount - totalExpenseAmount) },
            ]
          });
        }
      } else {
        // PDF: Download standalone printable report & allow saving as PDF
        let kpiCardsPdf = '';
        let tableRowsPdf = '';

        if (isPemasukanOnly) {
          kpiCardsPdf = `
            <div style="display:flex;gap:8px;margin-bottom:12px;">
              <div style="flex:1;padding:8px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#064E3B;font-weight:bold;">TOTAL PENERIMAAN</div>
                <div style="font-size:12px;font-weight:bold;color:#064E3B;margin-top:2px;">${formatRupiah(totalIncomeAmount)}</div>
              </div>
              <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:bold;">VOLUME TRANSAKSI</div>
                <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${totalIncomeTransactions} Transaksi</div>
              </div>
              <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:bold;">RATA-RATA / TRANSAKSI</div>
                <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${formatRupiah(avgIncomePerTrx)}</div>
              </div>
            </div>
          `;

          tableRowsPdf = `
            <table>
              <thead>
                <tr>
                  <th style="width:30px;">No</th>
                  <th>Sumber Penerimaan</th>
                  <th>Alokasi Unit</th>
                  <th style="text-align:center;">Jml Transaksi</th>
                  <th style="text-align:right;">Total Nominal</th>
                  <th style="text-align:center;">Porsi (%)</th>
                </tr>
              </thead>
              <tbody>
                ${currentIncome.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${item.source}</strong></td>
                    <td>${item.unit}</td>
                    <td style="text-align:center;">${item.transactionCount}</td>
                    <td style="text-align:right;font-weight:bold;color:#064E3B;">${formatRupiah(item.totalNominal)}</td>
                    <td style="text-align:center;">${item.percentage.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr style="background:#ecfdf5;font-weight:bold;">
                  <td colspan="4" style="text-align:right;color:#064E3B;">TOTAL PENERIMAAN:</td>
                  <td style="text-align:right;font-weight:bold;color:#064E3B;">${formatRupiah(totalIncomeAmount)}</td>
                  <td style="text-align:center;">100%</td>
                </tr>
              </tfoot>
            </table>
          `;
        } else if (isPengeluaranOnly) {
          kpiCardsPdf = `
            <div style="display:flex;gap:8px;margin-bottom:12px;">
              <div style="flex:1;padding:8px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#991b1b;font-weight:bold;">TOTAL PENGELUARAN</div>
                <div style="font-size:12px;font-weight:bold;color:#991b1b;margin-top:2px;">${formatRupiah(totalExpenseAmount)}</div>
              </div>
              <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:bold;">VOLUME TRANSAKSI</div>
                <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${totalExpenseTransactions} Transaksi</div>
              </div>
              <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:bold;">RATA-RATA / TRANSAKSI</div>
                <div style="font-size:12px;font-weight:bold;color:#1e293b;margin-top:2px;">${formatRupiah(avgExpensePerTrx)}</div>
              </div>
            </div>
          `;

          tableRowsPdf = `
            <table>
              <thead>
                <tr>
                  <th style="width:25px;">No</th>
                  <th>Kategori Pos Pengeluaran</th>
                  <th>Sumber Keuangan (Dana)</th>
                  <th>Alokasi Unit</th>
                  <th style="text-align:center;">Jml Trx</th>
                  <th style="text-align:right;">Total Nominal</th>
                  <th style="text-align:center;">Porsi (%)</th>
                </tr>
              </thead>
              <tbody>
                ${currentExpenses.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${item.category}</strong></td>
                    <td>
                      <span style="font-weight:bold;color:#064E3B;">${item.sumberKeuangan || 'Kas Operasional'}</span>
                      ${item.akunKas ? `<div style="font-size:8px;color:#64748b;">${item.akunKas}</div>` : ''}
                    </td>
                    <td>${item.unit}</td>
                    <td style="text-align:center;">${item.transactionCount}</td>
                    <td style="text-align:right;font-weight:bold;color:#991b1b;">${formatRupiah(item.totalNominal)}</td>
                    <td style="text-align:center;">${item.percentage.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr style="background:#fef2f2;font-weight:bold;">
                  <td colspan="5" style="text-align:right;color:#991b1b;">TOTAL PENGELUARAN:</td>
                  <td style="text-align:right;font-weight:bold;color:#991b1b;">${formatRupiah(totalExpenseAmount)}</td>
                  <td style="text-align:center;">100%</td>
                </tr>
              </tfoot>
            </table>
          `;
        } else {
          kpiCardsPdf = `
            <div style="display:flex;gap:8px;margin-bottom:12px;">
              <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:bold;">TOTAL PENERIMAAN</div>
                <div style="font-size:12px;font-weight:bold;color:#064E3B;margin-top:2px;">${formatRupiah(totalIncomeAmount)}</div>
              </div>
              <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:bold;">TOTAL BELANJA</div>
                <div style="font-size:12px;font-weight:bold;color:#b91c1c;margin-top:2px;">${formatRupiah(totalExpenseAmount)}</div>
              </div>
              <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:bold;">SURPLUS FISKAL</div>
                <div style="font-size:12px;font-weight:bold;color:#065f46;margin-top:2px;">${formatRupiah(totalIncomeAmount - totalExpenseAmount)}</div>
              </div>
            </div>
          `;

          tableRowsPdf = `
            <table>
              <thead>
                <tr>
                  <th style="width:30px;">No</th>
                  <th>Pos Anggaran / Komponen</th>
                  <th>Unit</th>
                  <th style="text-align:center;">Jml Transaksi</th>
                  <th style="text-align:right;">Realisasi Aktual</th>
                  <th style="text-align:center;">Porsi</th>
                </tr>
              </thead>
              <tbody>
                ${currentIncome.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>[Penerimaan]</strong> ${item.source}</td>
                    <td>${item.unit}</td>
                    <td style="text-align:center;">${item.transactionCount}</td>
                    <td style="text-align:right;font-weight:bold;color:#064E3B;">${formatRupiah(item.totalNominal)}</td>
                    <td style="text-align:center;">${item.percentage.toFixed(1)}%</td>
                  </tr>
                `).join('')}
                ${currentExpenses.map((item, idx) => `
                  <tr>
                    <td>${currentIncome.length + idx + 1}</td>
                    <td><strong>[Belanja]</strong> ${item.category}</td>
                    <td>${item.unit}</td>
                    <td style="text-align:center;">${item.transactionCount}</td>
                    <td style="text-align:right;font-weight:bold;color:#991b1b;">${formatRupiah(item.totalNominal)}</td>
                    <td style="text-align:center;">${item.percentage.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        }

        const contentHtml = `
          <div class="kop-header">
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="kop-logo">R</div>
              <div class="kop-text">
                <h1>Pondok Modern Raudhatussalam Mahato</h1>
                <p>Jl. Lintas Mahato KM. 24, Tambusai Utara, Rokan Hulu, Riau 28558 • Telp: (0762) 891234</p>
                <p>Sistem Informasi Keuangan (SIMKEU) Pesantren</p>
              </div>
            </div>
            <div style="text-align:right;">
              <span style="background:#f1f5f9;padding:4px 8px;border-radius:4px;font-weight:bold;font-size:9px;">DOKUMEN RESMI</span>
              <p style="margin-top:4px;font-size:9px;color:#64748b;">Dicetak: ${new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div style="text-align:center;margin-bottom:16px;">
            <h2 style="margin:0;font-size:13px;text-transform:uppercase;text-decoration:underline;">${reportTitle}</h2>
            <p style="margin:4px 0 0 0;font-size:10px;color:#475569;">Periode: ${periodText} • Tahun Ajaran 2026/2027</p>
          </div>

          ${kpiCardsPdf}

          ${tableRowsPdf}

          <div class="footer-signatures">
            <div class="signature-box">
              <p>Mengetahui,</p>
              <p><strong>Pimpinan Pondok Modern</strong></p>
              <div class="signature-space"></div>
              <p style="text-decoration:underline;font-weight:bold;">K.H. Rasyid Ridho, Lc., M.A.</p>
              <p style="font-size:8px;color:#64748b;">NIP. 19780512 200501 1 002</p>
            </div>
            <div class="signature-box">
              <p>Mahato, ${new Date().toLocaleDateString('id-ID')}</p>
              <p><strong>Bendahara Umum Pesantren</strong></p>
              <div class="signature-space"></div>
              <p style="text-decoration:underline;font-weight:bold;">H. Ahmad Syarif, M.Pd.</p>
              <p style="font-size:8px;color:#64748b;">NIP. 19850914 201101 1 004</p>
            </div>
          </div>
        `;

        downloadPrintableReport(filename, reportTitle, contentHtml);
      }

      onExportSuccess(selectedFormat, filename);
      onClose();
    }, 1100);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  return (
    <div
      id="export-report-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isGenerating) onClose();
      }}
    >
      <div
        id="export-report-modal"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">Export Laporan Keuangan</h3>
              <p className="text-[11px] text-[#64748B]">
                Unduh dokumen berstandar audit resmi pesantren
              </p>
            </div>
          </div>
          <button
            id="btn-close-export-modal"
            disabled={isGenerating}
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Report Metadata Box */}
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">Jenis Laporan:</span>
              <span className="font-bold text-[#1E293B]">{reportTitle}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">Periode:</span>
              <span className="font-semibold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {periodText}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">Sumber Data:</span>
              <span className="text-[#334155] font-medium">SIMKEU PM. Raudhatussalam Mahato</span>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
              Pilih Format Berkas
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="export-format-pdf"
                onClick={() => setSelectedFormat('PDF')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selectedFormat === 'PDF'
                    ? 'border-[#064E3B] bg-emerald-50/50 text-[#064E3B] shadow-xs'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    selectedFormat === 'PDF'
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E293B]">Dokumen PDF</div>
                  <div className="text-[10px] text-[#64748B]">Siap Cetak & Tanda Tangan</div>
                </div>
              </button>

              <button
                type="button"
                id="export-format-excel"
                onClick={() => setSelectedFormat('Excel')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selectedFormat === 'Excel'
                    ? 'border-[#064E3B] bg-emerald-50/50 text-[#064E3B] shadow-xs'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    selectedFormat === 'Excel'
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E293B]">Spreadsheet Excel</div>
                  <div className="text-[10px] text-[#64748B]">Formula & Olah Data Mentah</div>
                </div>
              </button>
            </div>
          </div>

          {/* Options Checklist */}
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
              Komponen Laporan yang Disertakan
            </label>
            <div className="space-y-2 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-include-summary"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#064E3B] w-4 h-4"
                />
                <span className="font-semibold">Sertakan Ringkasan Keuangan</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-include-transactions"
                  checked={includeTransactions}
                  onChange={(e) => setIncludeTransactions(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#064E3B] w-4 h-4"
                />
                <span>Sertakan Rincian Transaksi & Jurnal Pos Anggaran</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-include-charts"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#064E3B] w-4 h-4"
                />
                <span>Sertakan Visualisasi Grafik & Tren Arus Kas</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-include-audit-log"
                  checked={includeAuditLog}
                  onChange={(e) => setIncludeAuditLog(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#064E3B] w-4 h-4"
                />
                <span className="text-[#64748B]">Sertakan Log Audit & Jejak Keamanan Pengguna</span>
              </label>
            </div>
          </div>

          {/* Orientation if PDF */}
          {selectedFormat === 'PDF' && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#64748B] font-medium">Orientasi Halaman:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-orient-landscape"
                  onClick={() => setPaperOrientation('landscape')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium border transition ${
                    paperOrientation === 'landscape'
                      ? 'bg-[#064E3B] text-white border-[#064E3B]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0]'
                  }`}
                >
                  Landscape (Direkomendasikan)
                </button>
                <button
                  type="button"
                  id="btn-orient-portrait"
                  onClick={() => setPaperOrientation('portrait')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium border transition ${
                    paperOrientation === 'portrait'
                      ? 'bg-[#064E3B] text-white border-[#064E3B]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0]'
                  }`}
                >
                  Portrait
                </button>
              </div>
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-[#064E3B] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengompilasi data laporan terverifikasi...
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#064E3B] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="btn-cancel-export"
            disabled={isGenerating}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] hover:bg-[#E2E8F0]/50 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="button"
            id="btn-confirm-generate-report"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-[#064E3B] text-white hover:bg-[#053D2E] rounded-lg shadow-xs transition"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Laporan ({selectedFormat})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
