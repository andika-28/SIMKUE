import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  Edit,
  Info,
  Layers,
  X,
} from 'lucide-react';
import { UnitConfigItem, ClassStructureConfigItem } from '../../types';

interface SectionUnitKelasProps {
  units: UnitConfigItem[];
  classes: ClassStructureConfigItem[];
  onUpdateClass: (updatedClass: ClassStructureConfigItem) => void;
  onShowToast: (msg: string) => void;
}

export const SectionUnitKelas: React.FC<SectionUnitKelasProps> = ({
  units,
  classes,
  onUpdateClass,
  onShowToast,
}) => {
  const [editingClass, setEditingClass] = useState<ClassStructureConfigItem | null>(null);
  const [formData, setFormData] = useState<ClassStructureConfigItem | null>(null);

  const handleOpenEdit = (cls: ClassStructureConfigItem) => {
    setEditingClass(cls);
    setFormData({ ...cls });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onUpdateClass(formData);
      setEditingClass(null);
      onShowToast(`Data Kelas ${formData.level} (${formData.unit}) berhasil diperbarui.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Unit Pendidikan & Struktur Kelas</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Struktur jenjang pendidikan formal madrasah dan pemetaan rombongan belajar santri.
        </p>
      </div>

      {/* Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {unit.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{unit.code}</h3>
                    <p className="text-xs text-slate-500">{unit.fullName}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  {unit.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenjang Tingkat:</span>
                  <span className="font-bold text-slate-800">
                    Kelas {unit.classes.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kepala Madrasah:</span>
                  <span className="font-semibold text-slate-800">{unit.headmasterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Santri:</span>
                  <span className="font-extrabold text-emerald-700">{unit.totalStudents} Santri</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Class Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Struktur Rombongan Belajar (Kelas 1–6)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Total 300 Santri Mukim
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Tingkat Kelas</th>
                <th className="px-4 py-3">Unit Madrasah</th>
                <th className="px-4 py-3">Wali Kelas</th>
                <th className="px-4 py-3">Ruang Belajar</th>
                <th className="px-4 py-3 text-center">Jumlah Santri</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    Kelas {cls.level}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        cls.unit === 'MTs'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {cls.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{cls.waliKelas}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-[11px]">{cls.roomName}</td>
                  <td className="px-4 py-3.5 text-center font-extrabold text-slate-800">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {cls.studentCount}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cls)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3 text-slate-500" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Class Rule Info Card */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs text-emerald-950">
          <h4 className="font-bold">Aturan Pemetaan Otomatis Kelas & Unit:</h4>
          <p className="leading-relaxed text-emerald-900/90">
            Sistem mengunci pemetaan hierarki kelas: <strong>Kelas 1 – 3</strong> terasosiasi otomatis dengan unit <strong>MTs (Madrasah Tsanawiyah)</strong>, sedangkan <strong>Kelas 4 – 6</strong> terasosiasi otomatis dengan unit <strong>MA (Madrasah Aliyah)</strong>. Integrasi ini menjaga konsistensi pencatatan SPP dan kelulusan santri.
          </p>
        </div>
      </div>

      {/* Edit Class Modal */}
      {editingClass && formData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Kelas {editingClass.level} ({editingClass.unit})
              </h3>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Wali Kelas</label>
                <input
                  type="text"
                  value={formData.waliKelas}
                  onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Ruang Kelas / Gedung</label>
                <input
                  type="text"
                  value={formData.roomName}
                  onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Status Kelas</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
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
