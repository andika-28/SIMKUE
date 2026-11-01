import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { initialExpenseCategories } from '../../data/expenseData';

interface ExportExpenseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExport: (format: 'xlsx' | 'pdf', options: any) => void;
}

export const ExportExpenseReportModal: React.FC<ExportExpenseReportModalProps> = ({
  isOpen,
  onClose,
  onConfirmExport,
}) => {
  const [format, setFormat] = useState<'xlsx' | 'pdf'>('xlsx');
  const [periode, setPeriode] = useState<string>('Bulan Ini (Agustus 2026)');
  const [kategori, setKategori] = useState<string>('SEMUA');
  const [rekening, setRekening] = useState<string>('SEMUA');
  const [includeReceiptsList, setIncludeReceiptsList] = useState<boolean>(true);
  const [includeAuditLog, setIncludeAuditLog] = useState<boolean>(false);
  const [includeChartSummary, setIncludeChartSummary] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleExport = () => {
    onConfirmExport(format, {
      periode,
      kategori,
      rekening,
      includeReceiptsList,
      includeAuditLog,
      includeChartSummary,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="modal-export-expense-report"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 text-xs"
      >
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Export Laporan Pengeluaran
              </h3>
              <p className="text-slate-500">
                Download rekapitulasi data kas keluar untuk arsip dan rapat pimpinan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Format Dokumen
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFormat('xlsx')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  format === 'xlsx'
                    ? 'bg-emerald-50 border-[#064E3B] text-[#064E3B] font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <div>
                  <div className="text-xs">Excel Spreadsheet</div>
                  <div className="text-[10px] text-slate-400 font-normal font-mono">.xlsx</div>
                </div>
              </div>

              <div
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  format === 'pdf'
                    ? 'bg-rose-50 border-rose-600 text-rose-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-5 h-5 text-rose-600" />
                <div>
                  <div className="text-xs">Dokumen Resmi PDF</div>
                  <div className="text-[10px] text-slate-400 font-normal font-mono">.pdf (Siap Cetak)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Parameters */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Periode
              </label>
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium"
              >
                <option>Bulan Ini (Agustus 2026)</option>
                <option>Bulan Lalu (Juli 2026)</option>
                <option>Tahun Ajaran 2026/2027</option>
                <option>Semua Periode</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium"
              >
                <option value="SEMUA">Semua Kategori</option>
                {initialExpenseCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pengaturan Laporan
            </span>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeChartSummary}
                onChange={(e) => setIncludeChartSummary(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span>Sertakan ringkasan grafik & proporsi per unit</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeReceiptsList}
                onChange={(e) => setIncludeReceiptsList(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span>Sertakan daftar kelengkapan nota / lampiran bukti</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeAuditLog}
                onChange={(e) => setIncludeAuditLog(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span>Sertakan rincian log audit dan riwayat perubahan</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              id="btn-confirm-export-expense"
              onClick={handleExport}
              className="px-5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Dokumen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
