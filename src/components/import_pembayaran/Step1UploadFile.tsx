import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ArrowRight,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

export interface UploadedFileInfo {
  name: string;
  size: string;
  totalRows: number;
  uploadDate: string;
  format: 'xlsx' | 'csv';
}

interface Step1UploadFileProps {
  uploadedFile: UploadedFileInfo | null;
  onSelectFile: (fileInfo: UploadedFileInfo) => void;
  onRemoveFile: () => void;
  onNextStep: () => void;
  onDownloadTemplate: () => void;
}

export const Step1UploadFile: React.FC<Step1UploadFileProps> = ({
  uploadedFile,
  onSelectFile,
  onRemoveFile,
  onNextStep,
  onDownloadTemplate,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset file options for instant simulation
  const presetFiles: UploadedFileInfo[] = [
    {
      name: 'pembayaran_agustus_2026.xlsx',
      size: '245 KB',
      totalRows: 1245,
      uploadDate: '31 Agustus 2026',
      format: 'xlsx',
    },
    {
      name: 'pembayaran_harian_31082026.csv',
      size: '98 KB',
      totalRows: 480,
      uploadDate: '31 Agustus 2026',
      format: 'csv',
    },
    {
      name: 'pembayaran_tahunan_semester_ganjil.xlsx',
      size: '180 KB',
      totalRows: 620,
      uploadDate: '31 Agustus 2026',
      format: 'xlsx',
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const isCsv = file.name.endsWith('.csv');
      const sizeKb = Math.round(file.size / 1024) || 245;
      onSelectFile({
        name: file.name,
        size: `${sizeKb} KB`,
        totalRows: 1245,
        uploadDate: '31 Agustus 2026',
        format: isCsv ? 'csv' : 'xlsx',
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isCsv = file.name.endsWith('.csv');
      const sizeKb = Math.round(file.size / 1024) || 245;
      onSelectFile({
        name: file.name,
        size: `${sizeKb} KB`,
        totalRows: 1245,
        uploadDate: '31 Agustus 2026',
        format: isCsv ? 'csv' : 'xlsx',
      });
    }
  };

  return (
    <div id="step-1-upload-file" className="space-y-6">
      {/* Upload Container Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Upload Data Pembayaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload file Excel (.xlsx) atau CSV dari aplikasi pembayaran eksternal untuk dipadankan otomatis dengan tagihan santri SIMKEU.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".xlsx,.xls,.csv"
          className="hidden"
          id="import-payment-file-input"
        />

        {/* State 1: No File Uploaded (Drag & Drop Zone) */}
        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div
              id="dropzone-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                isDragging
                  ? 'border-[#064E3B] bg-emerald-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-[#064E3B] bg-slate-50/60 hover:bg-emerald-50/20'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">
                  Drag & Drop File di Sini
                </h4>
                <p className="text-xs text-slate-500">
                  atau klik tombol di bawah untuk memilih file dari komputer
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-mono">
                  .XLSX
                </span>
                <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-mono">
                  .CSV
                </span>
                <span>•</span>
                <span>Maksimum ukuran file: 10 MB</span>
              </div>

              <button
                type="button"
                id="btn-browse-file"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-2 px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Pilih File Pembayaran</span>
              </button>
            </div>

            {/* Quick Presets for Demo */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Gunakan File Sampel Siap Pakai:
                </span>
                <span className="text-[10px] text-slate-400">Klik untuk memuat data instan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {presetFiles.map((preset, idx) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => onSelectFile(preset)}
                    className="p-3 rounded-lg bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 text-left transition-all group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {preset.format === 'xlsx' ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#064E3B] truncate">
                        {preset.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>{preset.totalRows.toLocaleString('id-ID')} Baris</span>
                      <span>{preset.size}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* State 2: File Uploaded & Read Successfully */
          <div className="max-w-2xl mx-auto space-y-6">
            <div
              id="uploaded-file-card"
              className="bg-emerald-50/50 border-2 border-emerald-300 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    {uploadedFile.format === 'xlsx' ? (
                      <FileSpreadsheet className="w-8 h-8" />
                    ) : (
                      <FileText className="w-8 h-8" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900 font-mono truncate max-w-xs sm:max-w-sm">
                        {uploadedFile.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900 uppercase">
                        {uploadedFile.format}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span>Ukuran: <strong className="text-slate-800">{uploadedFile.size}</strong></span>
                      <span>•</span>
                      <span>Total Baris Terdeteksi: <strong className="text-[#064E3B]">{uploadedFile.totalRows.toLocaleString('id-ID')}</strong></span>
                      <span>•</span>
                      <span>{uploadedFile.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    id="btn-replace-file"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                    title="Ganti File"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ganti File</span>
                  </button>

                  <button
                    type="button"
                    id="btn-remove-file"
                    onClick={onRemoveFile}
                    className="p-2 text-rose-600 hover:text-rose-800 bg-white hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                    title="Hapus File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              <div className="mt-4 pt-3.5 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ File berhasil dibaca dan siap dipetakan ke field SIMKEU</span>
                </div>
                <span className="text-[11px] text-emerald-700">Encoding: UTF-8</span>
              </div>
            </div>

            {/* Actions for File Uploaded */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                id="btn-next-to-mapping"
                onClick={onNextStep}
                className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>Lanjutkan ke Mapping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Format Data yang Direkomendasikan */}
      <div
        id="card-recommended-format"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Format Data yang Direkomendasikan
              </h3>
              <p className="text-xs text-slate-500">
                Pastikan struktur kolom file Excel / CSV memuat atribut berikut agar rekonsiliasi berjalan 100% otomatis
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-download-excel-template"
            onClick={onDownloadTemplate}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-[#064E3B] font-bold rounded-xl border border-slate-200 transition-all text-xs cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#064E3B]" />
            <span>Download Template Excel</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Nomor Referensi', req: true, desc: 'Kode transaksi unik (PAY-...)' },
            { label: 'Tanggal Pembayaran', req: true, desc: 'Format YYYY-MM-DD / DD/MM/YYYY' },
            { label: 'NIS Santri', req: true, desc: 'Nomor Induk Santri (e.g. 2026001)' },
            { label: 'Nominal Pembayaran', req: true, desc: 'Nominal numerik Rupiah' },
            { label: 'Nama Santri', req: false, desc: 'Nama lengkap untuk verifikasi' },
            { label: 'Jenis Pembayaran', req: false, desc: 'Bulanan / Pembangunan / Kertas' },
            { label: 'Metode Pembayaran', req: false, desc: 'VA, QRIS, Transfer, Loket' },
            { label: 'Status Pembayaran', req: false, desc: 'Status SUCCESS / SETTLED' },
          ].map((col) => (
            <div
              key={col.label}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">{col.label}</span>
                {col.req ? (
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    Wajib *
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                    Opsional
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{col.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
