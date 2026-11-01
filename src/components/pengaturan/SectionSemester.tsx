import React, { useState } from 'react';
import {
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  X,
  AlertCircle,
} from 'lucide-react';
import { SemesterConfigItem } from '../../types';

interface SectionSemesterProps {
  semesters: SemesterConfigItem[];
  onUpdateSemester: (updatedSem: SemesterConfigItem) => void;
  onShowToast: (msg: string) => void;
}

export const SectionSemester: React.FC<SectionSemesterProps> = ({
  semesters,
  onUpdateSemester,
  onShowToast,
}) => {
  const [editingSemester, setEditingSemester] = useState<SemesterConfigItem | null>(null);
  const [formData, setFormData] = useState<SemesterConfigItem | null>(null);

  const handleOpenEdit = (sem: SemesterConfigItem) => {
    setEditingSemester(sem);
    setFormData({ ...sem });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onUpdateSemester(formData);
      setEditingSemester(null);
      onShowToast(`Pengaturan ${formData.name} berhasil diperbarui.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Pengaturan Semester</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pembagian masa kegiatan belajar mengajar dan alokasi tagihan tahunan semester 1 & 2.
        </p>
      </div>

      {/* Semester Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {semesters.map((sem, index) => {
          const isActive = sem.status === 'AKTIF';
          const isWaiting = sem.status === 'MENUNGGU';

          return (
            <div
              key={sem.id}
              className={`rounded-2xl border p-6 transition-all relative overflow-hidden bg-white ${
                isActive
                  ? 'border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/20'
                  : 'border-slate-200/80 shadow-2xs'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Semester {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{sem.name}</h3>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isActive ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      AKTIF
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-amber-600" />
                      MENUNGGU
                    </>
                  )}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="font-medium">Rentang Bulan:</span>
                  <span className="font-bold text-slate-900">{sem.period}</span>
                </div>

                <div className="flex justify-between py-1 text-slate-600">
                  <span className="font-medium">Tanggal Mulai:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(sem.startDate).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-1 text-slate-600">
                  <span className="font-medium">Tanggal Selesai:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(sem.endDate).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(sem)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-500" />
                  Edit Periode
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-blue-50/70 border border-blue-200/70 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Tagihan tahunan (Uang Pembangunan, Uang Kertas, Uang Kegiatan) dibagi rata menjadi <strong>2 tahap cicilan semester</strong>. Ketika Semester Genap diaktifkan, tagihan tahap 2 akan otomatis tersedia untuk dicicil oleh santri.
        </p>
      </div>

      {/* Edit Modal */}
      {editingSemester && formData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Edit {editingSemester.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSemester(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Rentang Bulan</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Tanggal Mulai</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Tanggal Selesai</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="MENUNGGU">MENUNGGU</option>
                  <option value="SELESAI">SELESAI</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSemester(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
