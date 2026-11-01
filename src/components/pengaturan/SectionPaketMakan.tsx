import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Users,
  X,
  Info,
} from 'lucide-react';
import { MealPackageConfigItem } from '../../types';

interface SectionPaketMakanProps {
  packages: MealPackageConfigItem[];
  onUpdatePackage: (updatedPkg: MealPackageConfigItem) => void;
  onAddPackage: (newPkg: MealPackageConfigItem) => void;
  onShowToast: (msg: string) => void;
}

export const SectionPaketMakan: React.FC<SectionPaketMakanProps> = ({
  packages,
  onUpdatePackage,
  onAddPackage,
  onShowToast,
}) => {
  const [editingPkg, setEditingPkg] = useState<MealPackageConfigItem | null>(null);
  const [formData, setFormData] = useState<MealPackageConfigItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPkgData, setNewPkgData] = useState({
    code: 'D' as any,
    badge: 'Kategori Khusus',
    name: '',
    description: '',
    monthlyFee: 350000,
  });

  const handleOpenEdit = (pkg: MealPackageConfigItem) => {
    setEditingPkg(pkg);
    setFormData({ ...pkg });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onUpdatePackage(formData);
      setEditingPkg(null);
      onShowToast(`Paket Makan ${formData.badge} berhasil diperbarui.`);
    }
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const newPkg: MealPackageConfigItem = {
      id: `mp-${Date.now()}`,
      code: newPkgData.code,
      badge: newPkgData.badge,
      name: newPkgData.name,
      description: newPkgData.description,
      monthlyFee: Number(newPkgData.monthlyFee),
      status: 'Aktif',
      studentCount: 0,
    };
    onAddPackage(newPkg);
    setIsAddModalOpen(false);
    onShowToast(`Paket Makan ${newPkg.name} berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Manajemen Paket Makan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur kategori biaya makan berdasarkan pola konsumsi harian santri di lingkungan pesantren.
          </p>
        </div>
        <button
          type="button"
          id="btn-tambah-paket-makan"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket Makan
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          const isFull = pkg.code === 'C';
          const isPartial = pkg.code === 'B';
          const isHome = pkg.code === 'A';

          return (
            <div
              key={pkg.id}
              className={`rounded-2xl border bg-white p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm relative overflow-hidden ${
                isFull
                  ? 'border-emerald-500/80 ring-1 ring-emerald-500/20'
                  : 'border-slate-200/80'
              }`}
            >
              {isFull && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  Terbanyak (Mukim)
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      isFull
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : isPartial
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {pkg.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {pkg.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[40px]">
                    {pkg.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Biaya Paket Makan
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-black text-slate-900">
                      Rp {pkg.monthlyFee.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ bulan</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Santri Terdaftar:
                  </span>
                  <span className="font-extrabold text-slate-800">{pkg.studentCount} Santri</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(pkg)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-500" />
                  Edit Paket
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Configuration Warning */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-100 text-amber-900 rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs text-amber-950">
          <h4 className="font-bold">Ketentuan Perubahan Tarif Paket Makan:</h4>
          <p className="leading-relaxed text-amber-900/90">
            Perubahan nominal tarif paket makan <strong>hanya berlaku untuk tagihan bulanan yang dibuat setelah perubahan disimpan</strong>. Tagihan yang telah digenerate pada bulan-bulan sebelumnya tidak akan berubah otomatis guna menjamin integritas rekam jejak audit keuangan.
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPkg && formData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Edit {editingPkg.badge} - {editingPkg.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPkg(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Nama Paket</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Deskripsi Alokasi Makan</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Nominal Per Bulan (Rp)</label>
                <input
                  type="number"
                  step="10000"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold text-sm"
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
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Perubahan tarif paket tidak akan mengubah invoice yang sudah diterbitkan.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Tambah Paket Makan Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Label Kategori</label>
                <input
                  type="text"
                  value={newPkgData.badge}
                  onChange={(e) => setNewPkgData({ ...newPkgData, badge: e.target.value })}
                  placeholder="Contoh: Kategori Khusus / D"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Nama Paket</label>
                <input
                  type="text"
                  value={newPkgData.name}
                  onChange={(e) => setNewPkgData({ ...newPkgData, name: e.target.value })}
                  placeholder="Contoh: Menu Khusus Alergi"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Deskripsi Alokasi</label>
                <textarea
                  rows={2}
                  value={newPkgData.description}
                  onChange={(e) => setNewPkgData({ ...newPkgData, description: e.target.value })}
                  placeholder="Deskripsi fasilitas konsumsi santri..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Tarif Bulanan (Rp)</label>
                <input
                  type="number"
                  step="10000"
                  value={newPkgData.monthlyFee}
                  onChange={(e) => setNewPkgData({ ...newPkgData, monthlyFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
