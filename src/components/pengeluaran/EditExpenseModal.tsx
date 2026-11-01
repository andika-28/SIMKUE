import React, { useState, useEffect } from 'react';
import {
  X,
  Edit,
  AlertTriangle,
  History,
  Save,
  DollarSign,
  Landmark,
  Coins,
  Building2,
} from 'lucide-react';
import {
  ExpenseItem,
  ExpenseAuditLog,
  ExpenseCategory,
  ExpenseInstitutionUnit,
  FundingSourceItem,
} from '../../types';
import {
  initialConfiguredCategories,
  initialInstitutionUnits,
  initialFundingSources,
} from '../../data/expenseSettingsData';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
  onSaveEdit: (
    updatedExpense: ExpenseItem,
    alasanPerubahan: string
  ) => void;
  availableCategories?: ExpenseCategory[];
  availableUnits?: ExpenseInstitutionUnit[];
  availableFundingSources?: FundingSourceItem[];
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSaveEdit,
  availableCategories = initialConfiguredCategories,
  availableUnits = initialInstitutionUnits,
  availableFundingSources = initialFundingSources,
}) => {
  const activeCategories = availableCategories.filter((c) => c.isActive);
  const activeUnits = availableUnits.filter((u) => u.isActive);
  const activeSources = availableFundingSources.filter((s) => s.isActive);

  const [kategori, setKategori] = useState<string>('');
  const [keterangan, setKeterangan] = useState<string>('');
  const [nominalRaw, setNominalRaw] = useState<string>('0');
  const [rekening, setRekening] = useState<'BNI Rekening 1' | 'BNI Rekening 2'>('BNI Rekening 1');
  const [sumberDana, setSumberDana] = useState<string>('');
  const [pengajuanOleh, setPengajuanOleh] = useState<string>('');
  const [unit, setUnit] = useState<any>('Dapur');
  const [alasanPerubahan, setAlasanPerubahan] = useState<string>('');

  useEffect(() => {
    if (expense) {
      setKategori(expense.kategori);
      setKeterangan(expense.keterangan);
      setNominalRaw(expense.nominal.toString());
      setRekening(expense.rekening);
      setSumberDana(expense.sumberKeuangan || 'Kas Operasional Utama Pesantren');
      setPengajuanOleh(expense.pengajuanOleh || '');
      setUnit(expense.unit || 'Dapur');
      setAlasanPerubahan('');
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const nominalNumber = parseInt(nominalRaw.replace(/\D/g, '') || '0', 10);

  const handleSourceChange = (newSourceName: string) => {
    setSumberDana(newSourceName);
    const matched = activeSources.find((s) => s.name === newSourceName);
    if (matched) {
      setRekening(matched.rekeningKas === 'BNI Rekening 2' ? 'BNI Rekening 2' : 'BNI Rekening 1');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alasanPerubahan.trim()) {
      alert('Wajib mengisi alasan perubahan untuk audit keuangan!');
      return;
    }

    const updated: ExpenseItem = {
      ...expense,
      kategori,
      keterangan,
      nominal: nominalNumber,
      rekening,
      sumberKeuangan: sumberDana,
      pengajuanOleh,
      unit,
    };

    onSaveEdit(updated, alasanPerubahan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="modal-edit-pengeluaran"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-xs"
      >
        <div className="p-5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Edit Transaksi Pengeluaran
              </h3>
              <p className="text-slate-600">
                No. Transaksi: <strong className="font-mono">{expense.transactionNo}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-amber-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Audit Alert */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Setiap perubahan pada transaksi pengeluaran akan dicatat secara otomatis ke dalam <strong>Audit Trail (Riwayat Aktivitas)</strong> dengan mencatat data sebelum dan sesudah perubahan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Kategori */}
            <div>
              <label htmlFor="edit-exp-category" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Kategori Pengeluaran
              </label>
              <select
                id="edit-exp-category"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:ring-1 focus:ring-amber-500"
              >
                {activeCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nominal */}
            <div>
              <label htmlFor="edit-exp-nominal" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Nominal Transaksi (Rp)
              </label>
              <input
                id="edit-exp-nominal"
                type="text"
                value={nominalNumber ? nominalNumber.toLocaleString('id-ID') : ''}
                onChange={(e) => setNominalRaw(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 font-mono focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Sumber Dana */}
            <div>
              <label htmlFor="edit-exp-sumberdana" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Sumber Keuangan (Dana)
              </label>
              <select
                id="edit-exp-sumberdana"
                value={sumberDana}
                onChange={(e) => handleSourceChange(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:ring-1 focus:ring-emerald-600 bg-emerald-50/30"
              >
                {activeSources.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.rekeningKas})
                  </option>
                ))}
              </select>
            </div>

            {/* Rekening Kas */}
            <div>
              <label htmlFor="edit-exp-rekening" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Rekening Kas Penampung
              </label>
              <select
                id="edit-exp-rekening"
                value={rekening}
                onChange={(e) => setRekening(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:ring-1 focus:ring-amber-500"
              >
                <option value="BNI Rekening 1">BNI Rekening 1 (Operasional & SPP)</option>
                <option value="BNI Rekening 2">BNI Rekening 2 (Pembangunan & Sarpras)</option>
              </select>
            </div>

            {/* Instansi / Unit */}
            <div>
              <label htmlFor="edit-exp-unit" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Instansi / Bagian Pengguna
              </label>
              <select
                id="edit-exp-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:ring-1 focus:ring-amber-500"
              >
                {activeUnits.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} — {u.keterangan || u.kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Pengajuan Oleh */}
            <div>
              <label htmlFor="edit-exp-pengaju" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Pengaju / Penanggung Jawab
              </label>
              <input
                id="edit-exp-pengaju"
                type="text"
                value={pengajuanOleh}
                onChange={(e) => setPengajuanOleh(e.target.value)}
                placeholder="Nama Pengaju"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Keterangan */}
            <div className="sm:col-span-2">
              <label htmlFor="edit-exp-keterangan" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Keterangan
              </label>
              <textarea
                id="edit-exp-keterangan"
                rows={2}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* MANDATORY ALASAN PERUBAHAN */}
            <div className="sm:col-span-2 bg-amber-50/70 p-3.5 rounded-xl border border-amber-300 space-y-1">
              <label htmlFor="edit-exp-alasan" className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                Alasan Perubahan Data <span className="text-rose-600">* (Wajib Diisi)</span>
              </label>
              <input
                id="edit-exp-alasan"
                type="text"
                required
                value={alasanPerubahan}
                onChange={(e) => setAlasanPerubahan(e.target.value)}
                placeholder="Contoh: Koreksi nominal belanja beras sesuai nota faktur asli"
                className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-amber-600"
              />
            </div>
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
              type="submit"
              id="btn-save-edit-expense"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
