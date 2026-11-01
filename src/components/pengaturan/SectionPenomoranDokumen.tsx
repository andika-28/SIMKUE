import React, { useState } from 'react';
import {
  FileText,
  Hash,
  Sparkles,
  CheckCircle2,
  Info,
  RotateCcw,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { DocumentNumberConfigItem } from '../../types';

interface SectionPenomoranDokumenProps {
  documents: DocumentNumberConfigItem[];
  onUpdateDocument: (updated: DocumentNumberConfigItem) => void;
  onShowToast: (msg: string) => void;
}

export const SectionPenomoranDokumen: React.FC<SectionPenomoranDokumenProps> = ({
  documents,
  onUpdateDocument,
  onShowToast,
}) => {
  const [editingDoc, setEditingDoc] = useState<DocumentNumberConfigItem | null>(null);
  const [patternInput, setPatternInput] = useState('');
  const [resetPeriodInput, setResetPeriodInput] = useState<'Tiap Bulan' | 'Tiap Tahun Ajaran' | 'Tidak Pernah Reset'>('Tiap Bulan');

  const generatePreview = (pattern: string) => {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const yy = yyyy.slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMm = romanMonths[now.getMonth()];

    return pattern
      .replace('{YYYY}', yyyy)
      .replace('{YY}', yy)
      .replace('{MM}', mm)
      .replace('{ROMAN_MM}', romanMm)
      .replace('{INDEX_4}', '0042')
      .replace('{INDEX_5}', '00042')
      .replace('{INDEX_3}', '042');
  };

  const handleOpenEdit = (doc: DocumentNumberConfigItem) => {
    setEditingDoc(doc);
    setPatternInput(doc.pattern);
    setResetPeriodInput(doc.resetPeriod);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      const updated: DocumentNumberConfigItem = {
        ...editingDoc,
        pattern: patternInput,
        resetPeriod: resetPeriodInput,
        example: generatePreview(patternInput),
      };
      onUpdateDocument(updated);
      setEditingDoc(null);
      onShowToast(`Format penomoran ${editingDoc.name} berhasil diperbarui.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Format Penomoran Dokumen Otomatis</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Standarisasi penomoran kwitansi, nomor invoice, voucher pengeluaran kas, dan berkas laporan audit.
        </p>
      </div>

      {/* Document Formats Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Daftar Skema Penomoran Dokumen
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Otomatis digenerate oleh sistem saat transaksi diterbitkan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Jenis Dokumen</th>
                <th className="px-4 py-3">Pola Format (Pattern)</th>
                <th className="px-4 py-3">Contoh Nomor Real-Time</th>
                <th className="px-4 py-3">Siklus Reset Nomor</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    {doc.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-700 font-semibold">
                    <code className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {doc.pattern}
                    </code>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] border border-emerald-200">
                      {doc.example}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">
                    {doc.resetPeriod}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(doc)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3 text-slate-500" />
                      Sesuaikan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Placeholder Guide */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          Variabel Placeholder Format Penomoran yang Didukung
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <code className="font-bold text-emerald-800 text-[11px] block">{'{YYYY}'}</code>
            <span className="text-[10px] text-slate-500">Tahun 4 digit (2026)</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <code className="font-bold text-emerald-800 text-[11px] block">{'{YY}'}</code>
            <span className="text-[10px] text-slate-500">Tahun 2 digit (26)</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <code className="font-bold text-emerald-800 text-[11px] block">{'{MM}'}</code>
            <span className="text-[10px] text-slate-500">Bulan 2 digit (09)</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <code className="font-bold text-emerald-800 text-[11px] block">{'{ROMAN_MM}'}</code>
            <span className="text-[10px] text-slate-500">Bulan Romawi (IX)</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <code className="font-bold text-emerald-800 text-[11px] block">{'{INDEX_4}'}</code>
            <span className="text-[10px] text-slate-500">Urut 4 digit (0001)</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <code className="font-bold text-emerald-800 text-[11px] block">{'{INDEX_5}'}</code>
            <span className="text-[10px] text-slate-500">Urut 5 digit (00001)</span>
          </div>
        </div>
      </div>

      {/* Edit Format Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Sesuaikan Format: {editingDoc.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Pola Nomor (Format Pattern)</label>
                <input
                  type="text"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              {/* Real-Time Live Preview */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Pratinjau Hasil Nomor:
                </span>
                <span className="font-mono text-sm font-black text-emerald-950 block">
                  {generatePreview(patternInput)}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Siklus Reset Nomor Urut</label>
                <select
                  value={resetPeriodInput}
                  onChange={(e) => setResetPeriodInput(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="Tiap Bulan">Tiap Bulan (Reset ke 0001 di awal bulan)</option>
                  <option value="Tiap Tahun Ajaran">Tiap Tahun Ajaran (Reset ke 0001 saat tahun ajaran baru)</option>
                  <option value="Tidak Pernah Reset">Tidak Pernah Reset (Nomor terus bertambah)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Format
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
