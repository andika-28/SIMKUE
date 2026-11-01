import React, { useState } from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  FileText,
  Check,
  Building2,
  Calendar,
  Layers,
  Phone,
  CheckSquare,
  Square,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { ArrearsKPIStats, ArrearsFilterState } from '../../types';

interface ArrearsExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: ArrearsKPIStats;
  initialFilter?: ArrearsFilterState;
  onConfirmExport: (config: {
    format: 'pdf' | 'excel';
    unit: string;
    kelas: string;
    jenisTunggakan: string;
    filterBulan: string;
    filterItemTahunan: string;
    includeGuardian: boolean;
    includeAging: boolean;
    includeSignature: boolean;
  }) => void;
}

export const ArrearsExportReportModal: React.FC<ArrearsExportReportModalProps> = ({
  isOpen,
  onClose,
  kpi,
  initialFilter,
  onConfirmExport,
}) => {
  if (!isOpen) return null;

  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [unit, setUnit] = useState<string>(initialFilter?.unit || 'Semua Unit');
  const [kelas, setKelas] = useState<string>(initialFilter?.kelas || 'Semua Kelas');
  const [jenisTunggakan, setJenisTunggakan] = useState<string>(
    initialFilter?.jenisTunggakan && initialFilter.jenisTunggakan !== 'Tagihan Bulanan' && initialFilter.jenisTunggakan !== 'Tagihan Tahunan'
      ? initialFilter.jenisTunggakan
      : initialFilter?.jenisTunggakan === 'Tagihan Bulanan'
      ? 'Bulanan Saja'
      : initialFilter?.jenisTunggakan === 'Tagihan Tahunan'
      ? 'Tahunan Saja'
      : 'Semua Jenis'
  );
  const [filterBulan, setFilterBulan] = useState<string>(initialFilter?.filterBulan || 'Semua Bulan');
  const [filterItemTahunan, setFilterItemTahunan] = useState<string>(
    initialFilter?.filterItemTahunan || 'Semua Item Tahunan'
  );
  const [includeGuardian, setIncludeGuardian] = useState<boolean>(true);
  const [includeAging, setIncludeAging] = useState<boolean>(true);
  const [includeSignature, setIncludeSignature] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmExport({
        format,
        unit,
        kelas,
        jenisTunggakan,
        filterBulan,
        filterItemTahunan,
        includeGuardian,
        includeAging,
        includeSignature,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          id="modal-export-arrears-report"
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Cetak Rekap Laporan Tunggakan
                </h3>
                <p className="text-xs text-slate-500">
                  SIMKEU PM. Raudhatussalam Mahato
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-export-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-xs">
            {/* Format Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Format Dokumen
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-format-pdf"
                  onClick={() => setFormat('pdf')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    format === 'pdf'
                      ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <FileText className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-bold text-xs">PDF Resmi</div>
                    <div className="text-[10px] text-slate-500">Kop surat & tanda tangan</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-format-excel"
                  onClick={() => setFormat('excel')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    format === 'excel'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-bold text-xs">Excel (.XLSX)</div>
                    <div className="text-[10px] text-slate-500">Data tabel lengkap olah data</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Filter Scope */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Unit Santri
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B]"
                >
                  <option value="Semua Unit">Semua Unit (MTs & MA)</option>
                  <option value="MTs">MTs Saja</option>
                  <option value="MA">MA Saja</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Tingkat Kelas
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B]"
                >
                  <option value="Semua Kelas">Semua Kelas (1 – 6)</option>
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                </select>
              </div>
            </div>

            {/* Filter Tagihan: Jenis, Bulan, Item Tahunan */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Filter Khusus Tagihan
                </span>
                <span className="text-[10px] text-[#064E3B] font-bold">
                  {jenisTunggakan === 'Bulanan Saja'
                    ? 'Mode Bulanan Saja'
                    : jenisTunggakan === 'Tahunan Saja'
                    ? 'Mode Tahunan Saja'
                    : 'Mode Semua Tagihan'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setJenisTunggakan('Semua Jenis');
                    setFilterBulan('Semua Bulan');
                    setFilterItemTahunan('Semua Item Tahunan');
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                    jenisTunggakan === 'Semua Jenis'
                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Semua Tagihan
                </button>
                <button
                  type="button"
                  onClick={() => setJenisTunggakan('Bulanan Saja')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                    jenisTunggakan === 'Bulanan Saja'
                      ? 'bg-amber-700 text-white border-amber-700 shadow-xs ring-2 ring-amber-500/20'
                      : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  Bulanan Saja
                </button>
                <button
                  type="button"
                  onClick={() => setJenisTunggakan('Tahunan Saja')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                    jenisTunggakan === 'Tahunan Saja'
                      ? 'bg-orange-700 text-white border-orange-700 shadow-xs ring-2 ring-orange-500/20'
                      : 'bg-white text-orange-900 border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  Tahunan (Per Item)
                </button>
              </div>

              {/* Sub-selectors depending on mode */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center justify-between">
                    <span>Bulan Menunggak</span>
                    {jenisTunggakan === 'Bulanan Saja' && (
                      <span className="text-amber-700 font-extrabold text-[9px]">★ Bulanan</span>
                    )}
                  </label>
                  <select
                    value={filterBulan}
                    onChange={(e) => setFilterBulan(e.target.value)}
                    disabled={jenisTunggakan === 'Tahunan Saja'}
                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 transition-all ${
                      jenisTunggakan === 'Tahunan Saja'
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : filterBulan !== 'Semua Bulan'
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold focus:ring-amber-500'
                        : 'bg-white border-slate-300 text-slate-800 focus:ring-[#064E3B]'
                    }`}
                  >
                    <option value="Semua Bulan">Semua Bulan Menunggak</option>
                    <option value="Agustus 2026">Agustus 2026</option>
                    <option value="Juli 2026">Juli 2026</option>
                    <option value="Juni 2026">Juni 2026</option>
                    <option value="Mei 2026">Mei 2026</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center justify-between">
                    <span>Item Tagihan Tahunan</span>
                    {jenisTunggakan === 'Tahunan Saja' && (
                      <span className="text-orange-700 font-extrabold text-[9px]">★ Per Item</span>
                    )}
                  </label>
                  <select
                    value={filterItemTahunan}
                    onChange={(e) => setFilterItemTahunan(e.target.value)}
                    disabled={jenisTunggakan === 'Bulanan Saja'}
                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 transition-all ${
                      jenisTunggakan === 'Bulanan Saja'
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : filterItemTahunan !== 'Semua Item Tahunan'
                        ? 'bg-orange-50 border-orange-400 text-orange-950 font-bold focus:ring-orange-500'
                        : 'bg-white border-slate-300 text-slate-800 focus:ring-[#064E3B]'
                    }`}
                  >
                    <option value="Semua Item Tahunan">Semua Item Tahunan</option>
                    <option value="pembangunan">Uang Pembangunan Saja</option>
                    <option value="kertas">Uang Kertas & Ujian Saja</option>
                    <option value="kegiatan">Uang Kegiatan Santri Saja</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Opsi Tambahan Laporan
              </span>

              <label
                onClick={() => setIncludeGuardian(!includeGuardian)}
                className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 select-none text-xs"
              >
                {includeGuardian ? (
                  <CheckSquare className="w-4 h-4 text-[#064E3B]" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Sertakan Nama & Nomor HP Wali Santri (Buku Penagihan)</span>
              </label>

              <label
                onClick={() => setIncludeAging(!includeAging)}
                className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 select-none text-xs"
              >
                {includeAging ? (
                  <CheckSquare className="w-4 h-4 text-[#064E3B]" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Sertakan Tabel Analisis Usia Tunggakan (Aging Breakdown)</span>
              </label>

              <label
                onClick={() => setIncludeSignature(!includeSignature)}
                className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 select-none text-xs"
              >
                {includeSignature ? (
                  <CheckSquare className="w-4 h-4 text-[#064E3B]" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Sertakan Kolom Pengesahan Bendahara & Mudir Pesantren</span>
              </label>
            </div>

            {/* Summary Box */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-amber-900 font-bold block">
                  Cakupan Laporan: {jenisTunggakan}
                </span>
                <span className="text-[11px] text-amber-800 block">
                  {filterBulan !== 'Semua Bulan' ? `Bulan: ${filterBulan} • ` : ''}
                  {filterItemTahunan !== 'Semua Item Tahunan' ? `Item: ${filterItemTahunan} • ` : ''}
                  Format: {format === 'pdf' ? 'Dokumen Cetak / PDF' : 'Spreadsheet Excel'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-amber-950 block">
                  {kpi.santriMenunggakCount} Santri Terdata
                </span>
                <span className="text-[11px] font-bold text-amber-800">
                  {formatRupiah(kpi.totalTunggakan)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="btn-cancel-export"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer text-xs"
            >
              Batal
            </button>

            <button
              type="button"
              id="btn-confirm-generate-report"
              disabled={isProcessing}
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer text-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isProcessing ? 'Memproses Dokumen...' : 'Unduh & Cetak'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
