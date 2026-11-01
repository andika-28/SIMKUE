import React, { useState } from 'react';
import {
  TrendingDown,
  Plus,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Lock,
  X,
  Info,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ExpenseCategoryConfigItem,
  ExpenseCategory,
  ExpenseInstitutionUnit,
  FundingSourceItem,
} from '../../types';
import { PengaturanPengeluaranModal } from '../pengeluaran/PengaturanPengeluaranModal';
import {
  loadStoredCategories,
  saveStoredCategories,
  loadStoredInstitutionUnits,
  saveStoredInstitutionUnits,
  loadStoredFundingSources,
  saveStoredFundingSources,
} from '../../data/expenseSettingsData';

interface SectionKategoriPengeluaranProps {
  categories: ExpenseCategoryConfigItem[];
  onAddCategory: (newCat: ExpenseCategoryConfigItem) => void;
  onUpdateCategory: (updatedCat: ExpenseCategoryConfigItem) => void;
  onShowToast: (msg: string) => void;
}

export const SectionKategoriPengeluaran: React.FC<SectionKategoriPengeluaranProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onShowToast,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategoryConfigItem | null>(null);
  const [editFormData, setEditFormData] = useState<ExpenseCategoryConfigItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Settings State
  const [storedCats, setStoredCats] = useState<ExpenseCategory[]>(() => loadStoredCategories());
  const [storedUnits, setStoredUnits] = useState<ExpenseInstitutionUnit[]>(() => loadStoredInstitutionUnits());
  const [storedSources, setStoredSources] = useState<FundingSourceItem[]>(() => loadStoredFundingSources());

  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleOpenEdit = (cat: ExpenseCategoryConfigItem) => {
    setEditingCategory(cat);
    setEditFormData({ ...cat });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      onUpdateCategory(editFormData);
      setEditingCategory(null);
      onShowToast(`Kategori ${editFormData.name} berhasil diperbarui.`);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCode = newCatCode.startsWith('EXP-')
      ? newCatCode.toUpperCase()
      : `EXP-${newCatCode.toUpperCase()}`;

    const newCategory: ExpenseCategoryConfigItem = {
      id: `exp-cat-${Date.now()}`,
      code: formattedCode,
      name: newCatName,
      status: 'Aktif',
      transactionCount: 0,
      totalSpent: 0,
      description: newCatDesc || `Pos anggaran untuk kebutuhan ${newCatName.toLowerCase()}.`,
    };

    onAddCategory(newCategory);
    setIsAddModalOpen(false);
    setNewCatName('');
    setNewCatCode('');
    setNewCatDesc('');
    onShowToast(`Kategori ${newCatName} berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Kategori & Pos Anggaran Pengeluaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola klasifikasi pos kas keluar, instansi/unit pengguna dana, dan sumber dana keuangan setiap pengeluaran.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            id="btn-pengaturan-lengkap-pengeluaran"
            onClick={() => setIsSettingsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            Atur Instansi & Sumber Dana
          </button>
          <button
            type="button"
            id="btn-tambah-kategori-pengeluaran"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Daftar Pos Anggaran ({categories.length} Kategori)
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Terintegrasi dengan Formulir Kas Keluar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Nama Kategori Pos</th>
                <th className="px-4 py-3">Kode Akun</th>
                <th className="px-4 py-3">Deskripsi Anggaran</th>
                <th className="px-4 py-3 text-center">Jumlah Transaksi</th>
                <th className="px-4 py-3 text-right">Total Realisasi Kas</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    {cat.name}
                    {cat.isSystemProtected && (
                      <span title="Pos Anggaran Inti Dilindungi Sistem">
                        <Lock className="w-3 h-3 text-emerald-600" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-emerald-800 font-semibold">
                    {cat.code}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-[11px] max-w-xs truncate">
                    {cat.description}
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                    {cat.transactionCount} Trx
                  </td>
                  <td className="px-4 py-3.5 text-right font-extrabold text-slate-900">
                    Rp {cat.totalSpent.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.status === 'Aktif' && <CheckCircle2 className="w-3 h-3" />}
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
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

      {/* Deletion Protection Rule Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-2 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          Aturan Perlindungan Data Riwayat Transaksi Pengeluaran
        </div>
        <p className="leading-relaxed text-amber-900/90">
          Kategori pengeluaran yang <strong>telah memiliki catatan transaksi keuangan tidak dapat dihapus secara permanen</strong> dari basis data. Jika suatu pos anggaran tidak digunakan lagi, Anda dapat mengubah statusnya menjadi <strong>Nonaktif</strong>. Transaksi historis akan tetap mempertahankan nama kategori aslinya untuk audit pembukuan.
        </p>
      </div>

      {/* Edit Modal */}
      {editingCategory && editFormData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Kategori: {editingCategory.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Nama Kategori</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Kode Akun</label>
                <input
                  type="text"
                  value={editFormData.code}
                  disabled={editFormData.isSystemProtected}
                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 uppercase disabled:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Deskripsi Penggunaan</label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="Aktif">Aktif (Tersedia di formulir pengeluaran)</option>
                  <option value="Nonaktif">Nonaktif (Dinonaktifkan / Ditutup)</option>
                </select>
              </div>

              {editingCategory.transactionCount > 0 && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900">
                  Kategori ini memiliki <strong>{editingCategory.transactionCount} transaksi</strong> tercatat. Perubahan nama tidak menghapus mutasi kas historis.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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
              <h3 className="text-sm font-bold text-slate-900">Tambah Pos Anggaran Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Nama Pos Pengeluaran</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Contoh: Pembelian Bahan Kebersihan"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Kode Akun / Prefix</label>
                <input
                  type="text"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  placeholder="Contoh: EXP-KEBERSIHAN"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 uppercase font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Deskripsi Alokasi</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Alokasi pos belanja dan peruntukan kas..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 resize-none"
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
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Configuration Modal for Categories, Institutions, and Funding Sources */}
      <PengaturanPengeluaranModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        categories={storedCats}
        institutionUnits={storedUnits}
        fundingSources={storedSources}
        onSaveCategories={(newCats) => {
          setStoredCats(newCats);
          saveStoredCategories(newCats);
          onShowToast('Daftar kategori pengeluaran berhasil diperbarui.');
        }}
        onSaveInstitutionUnits={(newUnits) => {
          setStoredUnits(newUnits);
          saveStoredInstitutionUnits(newUnits);
          onShowToast('Daftar instansi/unit pemakai dana berhasil diperbarui.');
        }}
        onSaveFundingSources={(newSources) => {
          setStoredSources(newSources);
          saveStoredFundingSources(newSources);
          onShowToast('Daftar sumber dana pengeluaran berhasil diperbarui.');
        }}
      />
    </div>
  );
};
