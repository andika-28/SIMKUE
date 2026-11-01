import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Table as TableIcon,
  Sparkles,
  Check,
} from 'lucide-react';
import { ColumnMappingItem } from '../../types';
import { defaultColumnMappings, sampleRawFilePreview } from '../../data/importPaymentData';

interface Step2ColumnMappingProps {
  onBackStep: () => void;
  onNextStep: () => void;
  fileName?: string;
}

export const Step2ColumnMapping: React.FC<Step2ColumnMappingProps> = ({
  onBackStep,
  onNextStep,
  fileName = 'pembayaran_agustus_2026.xlsx',
}) => {
  const [mappings, setMappings] = useState<ColumnMappingItem[]>(defaultColumnMappings);

  // Available headers detected in the uploaded file
  const availableFileHeaders = [
    'No. Transaksi',
    'Tanggal Bayar',
    'NIS',
    'Nama',
    'Jenis Tagihan',
    'Nominal',
    'Metode',
    'Status',
    'Kode Cabang',
    'Catatan Khusus',
    '-- Lewati Kolom Ini --',
  ];

  const handleMappingChange = (id: string, newFileColumn: string) => {
    setMappings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              fileColumn: newFileColumn,
              isAutoDetected: newFileColumn === item.fileColumn,
            }
          : item
      )
    );
  };

  const handleAutoMapAll = () => {
    setMappings(defaultColumnMappings);
  };

  const allRequiredMapped = mappings
    .filter((m) => m.isRequired)
    .every((m) => m.fileColumn !== '-- Lewati Kolom Ini --' && m.fileColumn !== '');

  return (
    <div id="step-2-column-mapping" className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
                <Sliders className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Mapping Kolom Data
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cocokkan header kolom dari file <strong className="text-slate-700 font-mono">[{fileName}]</strong> dengan field database SIMKEU.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-auto-map"
              onClick={handleAutoMapAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-bold rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deteksi Ulang Semua Kolom</span>
            </button>
          </div>
        </div>

        {/* Column Mapping Grid */}
        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-12 gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1 border-b border-slate-100">
            <div className="col-span-5 sm:col-span-4">Field SIMKEU (Target Database)</div>
            <div className="col-span-1 hidden sm:block text-center">Arah</div>
            <div className="col-span-7 sm:col-span-5">Kolom dari File Eksternal</div>
            <div className="col-span-12 sm:col-span-2 text-right sm:text-left">Status Kecocokan</div>
          </div>

          <div className="divide-y divide-slate-100">
            {mappings.map((mapping) => {
              const isMapped = mapping.fileColumn !== '-- Lewati Kolom Ini --' && mapping.fileColumn !== '';

              return (
                <div
                  key={mapping.id}
                  className="grid grid-cols-12 gap-3 items-center py-3 px-3 hover:bg-slate-50/80 rounded-xl transition-colors"
                >
                  {/* Left: SIMKEU Field */}
                  <div className="col-span-5 sm:col-span-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {mapping.label}
                      </span>
                      {mapping.isRequired && (
                        <span className="text-rose-600 font-bold text-xs" title="Field Wajib">*</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {mapping.description}
                    </p>
                  </div>

                  {/* Middle Arrow */}
                  <div className="col-span-1 hidden sm:flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-4 h-4 text-emerald-700" />
                  </div>

                  {/* Right: Dropdown Selector for File Column */}
                  <div className="col-span-7 sm:col-span-5">
                    <select
                      value={mapping.fileColumn}
                      onChange={(e) => handleMappingChange(mapping.id, e.target.value)}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B] transition-all cursor-pointer ${
                        !isMapped && mapping.isRequired
                          ? 'border-rose-400 text-rose-900 bg-rose-50/30'
                          : 'border-slate-300 text-slate-800'
                      }`}
                    >
                      {availableFileHeaders.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-12 sm:col-span-2 flex items-center justify-end sm:justify-start">
                    {mapping.isAutoDetected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span>Otomatis terdeteksi</span>
                      </span>
                    ) : isMapped ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        Dipetakan manual
                      </span>
                    ) : mapping.isRequired ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Belum Dipetakan</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Dilewati
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contoh Data dari File (Data Sample Preview) */}
      <div
        id="card-sample-preview"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <TableIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Contoh Data dari File (Sample 5 Baris Pertama)
            </h3>
            <p className="text-[11px] text-slate-500">
              Verifikasi isi data mentah sebelum dievaluasi oleh sistem pencocokan tagihan SIMKEU
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                <th className="py-2.5 px-3">No. Transaksi</th>
                <th className="py-2.5 px-3">Tanggal Bayar</th>
                <th className="py-2.5 px-3">NIS</th>
                <th className="py-2.5 px-3">Nama</th>
                <th className="py-2.5 px-3">Jenis</th>
                <th className="py-2.5 px-3">Nominal</th>
                <th className="py-2.5 px-3">Metode</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleRawFilePreview.map((row, idx) => (
                <tr key={row.noTrans} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    {row.noTrans}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{row.tgl}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{row.nis}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{row.nama}</td>
                  <td className="py-2.5 px-3 text-slate-700">{row.jenis}</td>
                  <td className="py-2.5 px-3 font-extrabold text-[#064E3B]">{row.nominal}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.metode}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 2 Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          id="btn-back-to-upload"
          onClick={onBackStep}
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          id="btn-next-to-preview"
          disabled={!allRequiredMapped}
          onClick={onNextStep}
          className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <span>Lanjutkan ke Preview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
