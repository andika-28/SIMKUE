import React, { useState } from 'react';
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Receipt,
  Printer,
  ShieldCheck,
  Save,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface SectionAturanPembayaranProps {
  onShowToast: (msg: string) => void;
}

export const SectionAturanPembayaran: React.FC<SectionAturanPembayaranProps> = ({ onShowToast }) => {
  const [billIssueDate, setBillIssueDate] = useState(1);
  const [dueDate, setDueDate] = useState(10);
  const [requireFullPaymentMonthly, setRequireFullPaymentMonthly] = useState(true);
  const [maxAnnualInstallments, setMaxAnnualInstallments] = useState(2);
  const [autoMatchImport, setAutoMatchImport] = useState(true);
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(true);
  const [allowOverpaymentCredit, setAllowOverpaymentCredit] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Kebijakan dan aturan pembayaran berhasil diperbarui.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Aturan Pembayaran & Penagihan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kebijakan jatuh tempo, validasi pembayaran santri, dan parameter rekonsiliasi otomatis.
          </p>
        </div>
        <button
          type="submit"
          id="btn-simpan-aturan-pembayaran"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          Simpan Aturan
        </button>
      </div>

      {/* Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Siklus Tanggal */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Siklus Tanggal Penagihan
              </h3>
              <p className="text-[11px] text-slate-500">Penetapan tanggal invoice & batas jatuh tempo</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Tanggal Terbit Tagihan Bulanan</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Tanggal</span>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={billIssueDate}
                  onChange={(e) => setBillIssueDate(Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-center text-slate-900"
                />
                <span className="text-slate-500">setiap bulan kalender</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Batas Waktu Jatuh Tempo (Due Date)</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Tanggal</span>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={dueDate}
                  onChange={(e) => setDueDate(Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-center text-emerald-800"
                />
                <span className="text-slate-500">setiap bulan kalender</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Tagihan yang belum dibayar melewati tanggal ini akan otomatis masuk ke daftar <strong>Tunggakan Santri</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Validasi Pembayaran */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Validasi & Skema Angsuran
              </h3>
              <p className="text-[11px] text-slate-500">Ketentuan pelunasan dan cicilan santri</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <span className="font-bold text-slate-800 block">Wajib Bayar Bulanan Sekaligus</span>
                <p className="text-[10px] text-slate-500">Tagihan bulanan tidak dapat dicicil sebagian</p>
              </div>
              <button
                type="button"
                onClick={() => setRequireFullPaymentMonthly(!requireFullPaymentMonthly)}
                className={`p-1 rounded-lg transition-colors ${
                  requireFullPaymentMonthly ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {requireFullPaymentMonthly ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div>
                <span className="font-bold text-slate-800 block">Maksimal Cicilan Tagihan Tahunan</span>
                <p className="text-[10px] text-slate-500">Dibagi dalam tahap semester (Ganjil / Genap)</p>
              </div>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg text-xs">
                {maxAnnualInstallments} Tahap
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Parameters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-emerald-700" />
          Automasi Sistem Transaksi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div>
              <span className="font-bold text-slate-800 block">Pencocokan Otomatis Import Bank</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Cocokkan mutasi rekening bank dengan tagihan berdasarkan NIS & nominal santri
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoMatchImport(!autoMatchImport)}
              className={`p-1 rounded-lg transition-colors ${
                autoMatchImport ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              {autoMatchImport ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div>
              <span className="font-bold text-slate-800 block">Generate Kwitansi Otomatis</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Terbitkan nomor kuitansi resmi segera setelah pembayaran dinyatakan Lunas
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoPrintReceipt(!autoPrintReceipt)}
              className={`p-1 rounded-lg transition-colors ${
                autoPrintReceipt ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              {autoPrintReceipt ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
