import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  FileSignature,
  Stamp,
  Save,
  CheckCircle2,
  Eye,
} from 'lucide-react';

interface SectionFormatLaporanProps {
  onShowToast: (msg: string) => void;
}

export const SectionFormatLaporan: React.FC<SectionFormatLaporanProps> = ({ onShowToast }) => {
  const [paperSize, setPaperSize] = useState('A4');
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>('Landscape');
  const [showWatermark, setShowWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('SALINAN RESMI');
  const [footerNote, setFooterNote] = useState(
    'Dicetak secara otomatis melalui Sistem Informasi Manajemen Keuangan (SIMKEU) PM. Raudhatussalam Mahato.'
  );

  // Signatures
  const [directorName, setDirectorName] = useState('KH. Muhammad Arifin, M.Pd');
  const [directorTitle, setDirectorTitle] = useState('Pimpinan Pesantren');
  const [financeHeadName, setFinanceHeadName] = useState('Ust. Ahmad Fauzi, S.E.I');
  const [financeHeadTitle, setFinanceHeadTitle] = useState('Direktur Keuangan');
  const [treasurerInName, setTreasurerInName] = useState('Ust. Zulfikar, S.Pd');
  const [treasurerInTitle, setTreasurerInTitle] = useState('Bendahara Penerimaan');
  const [treasurerOutName, setTreasurerOutName] = useState('Ust. Ridwan Siregar');
  const [treasurerOutTitle, setTreasurerOutTitle] = useState('Bendahara Pengeluaran');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Format dan standarisasi laporan keuangan berhasil disimpan.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Format & Standar Laporan Keuangan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi pejabat penandatangan berkas, kop cetak, tata letak kertas, dan catatan kaki audit.
          </p>
        </div>
        <button
          type="submit"
          id="btn-simpan-format-laporan"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          Simpan Format Laporan
        </button>
      </div>

      {/* Signatures Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <FileSignature className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Pejabat Penandatangan Laporan Resmi
            </h3>
            <p className="text-[11px] text-slate-500">
              Nama dan jabatan yang dicantumkan pada kolom pengesahan laporan berkala
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-[11px] block">1. Pimpinan Lembaga</span>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Jabatan Struktural</label>
              <input
                type="text"
                value={directorTitle}
                onChange={(e) => setDirectorTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-[11px] block">2. Direktur Keuangan</span>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={financeHeadName}
                onChange={(e) => setFinanceHeadName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Jabatan Struktural</label>
              <input
                type="text"
                value={financeHeadTitle}
                onChange={(e) => setFinanceHeadTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-[11px] block">3. Bendahara Penerimaan (Kas Masuk)</span>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={treasurerInName}
                onChange={(e) => setTreasurerInName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Jabatan Struktural</label>
              <input
                type="text"
                value={treasurerInTitle}
                onChange={(e) => setTreasurerInTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-[11px] block">4. Bendahara Pengeluaran (Kas Keluar)</span>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={treasurerOutName}
                onChange={(e) => setTreasurerOutName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px]">Jabatan Struktural</label>
              <input
                type="text"
                value={treasurerOutTitle}
                onChange={(e) => setTreasurerOutTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Print Format Settings */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Printer className="w-4 h-4 text-emerald-700" />
          Format Cetak & Catatan Kaki Dokumen
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Ukuran Kertas Standar</label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="A4">A4 (210 x 297 mm)</option>
              <option value="F4 / Folio">F4 / Folio (215 x 330 mm)</option>
              <option value="Legal">Legal (216 x 356 mm)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Orientasi Default Tabel</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="Landscape">Landscape (Lebar - Direkomendasikan)</option>
              <option value="Portrait">Portrait (Tinggi)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700">Teks Catatan Kaki Otomatis (Footer)</label>
          <input
            type="text"
            value={footerNote}
            onChange={(e) => setFooterNote(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs"
          />
        </div>
      </div>
    </form>
  );
};
