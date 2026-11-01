import React, { useState } from 'react';
import {
  Receipt,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Edit,
  Info,
  Layers,
  HelpCircle,
  X,
} from 'lucide-react';
import { MonthlyBillTypeConfigItem, AnnualBillTypeConfigItem } from '../../types';

interface SectionJenisNominalTagihanProps {
  monthlyBills: MonthlyBillTypeConfigItem[];
  annualBills: AnnualBillTypeConfigItem[];
  onUpdateMonthlyBill: (updated: MonthlyBillTypeConfigItem) => void;
  onUpdateAnnualBill: (updated: AnnualBillTypeConfigItem) => void;
  onShowToast: (msg: string) => void;
}

export const SectionJenisNominalTagihan: React.FC<SectionJenisNominalTagihanProps> = ({
  monthlyBills,
  annualBills,
  onUpdateMonthlyBill,
  onUpdateAnnualBill,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'bulanan' | 'tahunan'>('bulanan');

  // Edit monthly modal state
  const [editingMonthly, setEditingMonthly] = useState<MonthlyBillTypeConfigItem | null>(null);
  const [monthlyForm, setMonthlyForm] = useState<MonthlyBillTypeConfigItem | null>(null);

  // Edit annual modal state
  const [editingAnnual, setEditingAnnual] = useState<AnnualBillTypeConfigItem | null>(null);
  const [annualForm, setAnnualForm] = useState<AnnualBillTypeConfigItem | null>(null);

  const handleOpenEditMonthly = (item: MonthlyBillTypeConfigItem) => {
    setEditingMonthly(item);
    setMonthlyForm({ ...item });
  };

  const handleSaveMonthly = (e: React.FormEvent) => {
    e.preventDefault();
    if (monthlyForm) {
      onUpdateMonthlyBill({
        ...monthlyForm,
        lastUpdated: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      });
      setEditingMonthly(null);
      onShowToast(`Konfigurasi tagihan ${monthlyForm.name} berhasil disimpan.`);
    }
  };

  const handleOpenEditAnnual = (item: AnnualBillTypeConfigItem) => {
    setEditingAnnual(item);
    setAnnualForm({ ...item });
  };

  const handleSaveAnnual = (e: React.FormEvent) => {
    e.preventDefault();
    if (annualForm) {
      const sem1New = Math.round(annualForm.amountNewStudent / 2);
      const sem2New = annualForm.amountNewStudent - sem1New;
      const sem1Old = Math.round(annualForm.amountOldStudent / 2);
      const sem2Old = annualForm.amountOldStudent - sem1Old;

      onUpdateAnnualBill({
        ...annualForm,
        sem1AmountNew: sem1New,
        sem2AmountNew: sem2New,
        sem1AmountOld: sem1Old,
        sem2AmountOld: sem2Old,
      });
      setEditingAnnual(null);
      onShowToast(`Konfigurasi tagihan ${annualForm.name} berhasil disimpan.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Konfigurasi Tagihan Santri</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur struktur komponen tarif tagihan rutin bulanan dan pembiayaan tahunan/semester pesantren.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          id="tab-tagihan-bulanan"
          onClick={() => setActiveTab('bulanan')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'bulanan'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Tagihan Bulanan (Reguler)
        </button>
        <button
          type="button"
          id="tab-tagihan-tahunan"
          onClick={() => setActiveTab('tahunan')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'tahunan'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Tagihan Tahunan & Semester
        </button>
      </div>

      {/* TAB 1: TAGIHAN BULANAN */}
      {activeTab === 'bulanan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Daftar Komponen Tagihan Bulanan
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Otomatis dihitung saat Generate Tagihan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="px-5 py-3">Jenis Tagihan</th>
                    <th className="px-4 py-3">Nominal Default</th>
                    <th className="px-4 py-3">Frekuensi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Terakhir Diubah</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {monthlyBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {bill.name}
                        <span className="block text-[10px] text-slate-400 font-mono font-normal">
                          Kode: {bill.code}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-slate-900">
                        {typeof bill.defaultAmount === 'number' ? (
                          <span>Rp {bill.defaultAmount.toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold text-[11px] border border-emerald-200">
                            {bill.defaultAmount}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{bill.frequency}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">{bill.lastUpdated}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditMonthly(bill)}
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

          {/* Monthly Bill Information Rule Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              <Info className="w-4 h-4 text-emerald-700" />
              Aturan Tagihan & Pembayaran Bulanan Santri
            </div>
            <p className="text-xs text-emerald-900/90 leading-relaxed">
              Setiap santri memiliki tagihan bulanan yang di-generate serentak pada tanggal 1 setiap bulan. Total tagihan bulanan santri terdiri dari kombinasi 3 komponen wajib:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-emerald-200/70 text-xs">
                <span className="font-bold text-slate-900 block">1. SPP Bulanan</span>
                <span className="text-[11px] text-slate-500">Tarif tetap Rp 200.000 / santri</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200/70 text-xs">
                <span className="font-bold text-slate-900 block">2. Uang Makan</span>
                <span className="text-[11px] text-slate-500">Kategori A (Rp0), B (Rp200rb), C (Rp600rb)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200/70 text-xs">
                <span className="font-bold text-slate-900 block">3. Listrik & Air</span>
                <span className="text-[11px] text-slate-500">Tarif asrama Rp 50.000 / santri</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Aturan Pembayaran:</strong> Tagihan bulanan wajib diselesaikan sekaligus dalam 1 transaksi (tidak diperkenankan dicicil sebagian).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TAGIHAN TAHUNAN */}
      {activeTab === 'tahunan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Daftar Tagihan Tahunan & Semester
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Dapat dicicil per semester
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="px-5 py-3">Jenis Tagihan</th>
                    <th className="px-4 py-3">Santri Baru</th>
                    <th className="px-4 py-3">Santri Lama</th>
                    <th className="px-4 py-3">Frekuensi</th>
                    <th className="px-4 py-3">Skema Cicilan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {annualBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {bill.name}
                        <span className="block text-[10px] text-slate-400 font-mono font-normal">
                          Kode: {bill.code}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-slate-900">
                        Rp {bill.amountNewStudent.toLocaleString('id-ID')}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          (Sem 1: Rp {bill.sem1AmountNew.toLocaleString('id-ID')})
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-emerald-800">
                        Rp {bill.amountOldStudent.toLocaleString('id-ID')}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          (Sem 1: Rp {bill.sem1AmountOld.toLocaleString('id-ID')})
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{bill.frequency}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {bill.installments}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAnnual(bill)}
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

          {/* Annual Bill Rule Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Aturan & Ketentuan Tagihan Tahunan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">✓ Tagihan Dapat Dicicil</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Wali santri diperkenankan mencicil pembayaran tagihan tahunan dalam 2 tahap pembayaran.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">✓ Maksimal 2 Tahap</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tahap 1 jatuh tempo pada Semester Ganjil dan Tahap 2 jatuh tempo pada Semester Genap.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">✓ Pembedaan Santri Baru vs Lama</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Uang pembangunan santri baru sebesar Rp 1.500.000, sedangkan santri lama hanya Rp 400.000.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Warning Callout */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Ketentuan Integritas Audit:</strong> Perubahan nominal konfigurasi tidak akan mengubah tagihan yang telah dibuat sebelumnya. Nilai baru hanya berlaku efektif untuk periode penagihan berikutnya.
        </p>
      </div>

      {/* Edit Monthly Modal */}
      {editingMonthly && monthlyForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Tagihan: {editingMonthly.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMonthly(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMonthly} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Nama Tagihan</label>
                <input
                  type="text"
                  value={monthlyForm.name}
                  onChange={(e) => setMonthlyForm({ ...monthlyForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-semibold"
                  required
                />
              </div>

              {!monthlyForm.isDynamicMeal ? (
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Nominal Default (Rp)</label>
                  <input
                    type="number"
                    step="5000"
                    value={typeof monthlyForm.defaultAmount === 'number' ? monthlyForm.defaultAmount : 200000}
                    onChange={(e) => setMonthlyForm({ ...monthlyForm, defaultAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold text-sm"
                    required
                  />
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <p className="font-bold">Nominal Berdasarkan Paket Makan</p>
                  <p className="text-[11px] mt-0.5">
                    Tarif tagihan ini mengambil data langsung dari menu <strong>Paket Makan Santri</strong> (Kategori A, B, C).
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Status</label>
                <select
                  value={monthlyForm.status}
                  onChange={(e) => setMonthlyForm({ ...monthlyForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMonthly(null)}
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

      {/* Edit Annual Modal */}
      {editingAnnual && annualForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Tagihan: {editingAnnual.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingAnnual(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnual} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Nama Tagihan</label>
                <input
                  type="text"
                  value={annualForm.name}
                  onChange={(e) => setAnnualForm({ ...annualForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Nominal Santri Baru (Rp)</label>
                  <input
                    type="number"
                    step="50000"
                    value={annualForm.amountNewStudent}
                    onChange={(e) => setAnnualForm({ ...annualForm, amountNewStudent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Nominal Santri Lama (Rp)</label>
                  <input
                    type="number"
                    step="50000"
                    value={annualForm.amountOldStudent}
                    onChange={(e) => setAnnualForm({ ...annualForm, amountOldStudent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold text-emerald-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Metode Pembayaran</label>
                <select
                  value={annualForm.installments}
                  onChange={(e) => setAnnualForm({ ...annualForm, installments: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="2 Semester">2 Semester (Cicilan 50% Ganjil / 50% Genap)</option>
                  <option value="Sekaligus">Sekaligus (Lunas di Awal Tahun)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Status</label>
                <select
                  value={annualForm.status}
                  onChange={(e) => setAnnualForm({ ...annualForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAnnual(null)}
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
