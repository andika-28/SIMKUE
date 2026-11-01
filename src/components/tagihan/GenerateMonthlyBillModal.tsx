import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Tag,
  Users,
} from 'lucide-react';
import { StudentUnit } from '../../types';

interface GenerateMonthlyBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPeriod: string;
  onConfirmGenerate: (period: string, unit: string, applyDiscount: boolean, discountAmount: number) => void;
}

export const GenerateMonthlyBillModal: React.FC<GenerateMonthlyBillModalProps> = ({
  isOpen,
  onClose,
  currentPeriod,
  onConfirmGenerate,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('September 2026');
  const [selectedUnit, setSelectedUnit] = useState<'Semua Unit' | 'MTs' | 'MA'>('Semua Unit');
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(150000);
  const [discountReason, setDiscountReason] = useState('Potongan Dapur Santri Libur Kepulangan');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmGenerate(selectedPeriod, selectedUnit, applyDiscount, discountAmount);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div
          id="modal-generate-tagihan"
          className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Generate Tagihan Bulanan Santri
                </h3>
                <p className="text-xs text-[#64748B]">
                  Kalkulasi otomatis SPP + Uang Makan Paket + Listrik & Air
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* 1. Periode Tagihan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Pilih Periode Bulan Tagihan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Agustus 2026', 'September 2026', 'Oktober 2026'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      selectedPeriod === p
                        ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Target Unit Santri */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Target Unit Santri
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Semua Unit', label: 'Semua Unit (300 Santri)' },
                  { id: 'MTs', label: 'MTs (Kelas 1–3)' },
                  { id: 'MA', label: 'MA (Kelas 4–6)' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUnit(u.id as any)}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium text-center transition-all ${
                      selectedUnit === u.id
                        ? 'bg-emerald-50 text-[#064E3B] border-emerald-400 font-bold ring-1 ring-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Business Formula Info Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-2 text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-[#064E3B]">
                <Info className="w-4 h-4" />
                <span>Ketentuan Rumus Tagihan Bulanan:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-emerald-900 text-[11px] leading-relaxed">
                <li><strong>SPP Wajib:</strong> Rp200.000 / santri</li>
                <li><strong>Listrik & Air Asrama:</strong> Rp50.000 / santri</li>
                <li>
                  <strong>Uang Makan Dapur:</strong> Paket A (Rp0), Paket B (Rp200.000), Paket C (Rp600.000)
                </li>
                <li>
                  <em>Tagihan bulanan wajib dilunasi penuh (tidak dapat dicicil parsial).</em>
                </li>
              </ul>
            </div>

            {/* 4. Optional Special Discount Configuration */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-800">
                    Terapkan Potongan / Diskon Khusus Periode Ini
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="chk-discount"
                  checked={applyDiscount}
                  onChange={(e) => setApplyDiscount(e.target.checked)}
                  className="w-4 h-4 text-[#064E3B] rounded border-slate-300 focus:ring-[#064E3B] cursor-pointer"
                />
              </div>

              {applyDiscount && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Nominal Diskon (Rp)
                    </label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Keterangan Diskon
                    </label>
                    <input
                      type="text"
                      value={discountReason}
                      onChange={(e) => setDiscountReason(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                id="btn-confirm-generate-bills"
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{isProcessing ? 'Memproses Generate...' : `Generate Tagihan (${selectedPeriod})`}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
