import React from 'react';
import {
  Plus,
  Upload,
  Download,
  Tag,
  Landmark,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';

interface ExpenseQuickActionsProps {
  onOpenCreateModal: () => void;
  onOpenQuickUpload: () => void;
  onOpenExportModal: () => void;
  onOpenCategoryGuide: () => void;
  onOpenSettingsModal?: () => void;
  bni1Balance: number;
  bni2Balance: number;
  currentRole: 'Bendahara' | 'Administrator' | 'Pimpinan';
  onChangeRole: (role: 'Bendahara' | 'Administrator' | 'Pimpinan') => void;
}

export const ExpenseQuickActions: React.FC<ExpenseQuickActionsProps> = ({
  onOpenCreateModal,
  onOpenQuickUpload,
  onOpenExportModal,
  onOpenCategoryGuide,
  onOpenSettingsModal,
  bni1Balance,
  bni2Balance,
  currentRole,
  onChangeRole,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  return (
    <div
      id="expense-quick-actions-bar"
      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4"
    >
      {/* Left: Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          id="btn-catat-pengeluaran"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#047857] active:scale-[0.98] text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer focus:ring-2 focus:ring-[#064E3B]/30"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Catat Pengeluaran</span>
        </button>

        <button
          type="button"
          id="btn-upload-bukti"
          onClick={onOpenQuickUpload}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer hover:text-emerald-800"
        >
          <Upload className="w-4 h-4 text-emerald-700" />
          <span>Upload Bukti Transaksi</span>
        </button>

        <button
          type="button"
          id="btn-export-pengeluaran"
          onClick={onOpenExportModal}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer hover:text-emerald-800"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Pengeluaran</span>
        </button>

        <button
          type="button"
          id="btn-panduan-kategori"
          onClick={onOpenCategoryGuide}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span>Panduan Pos</span>
        </button>

        {onOpenSettingsModal && (
          <button
            type="button"
            id="btn-pengaturan-pos-sumberdana"
            onClick={onOpenSettingsModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-[#064E3B] text-xs font-bold rounded-xl border border-emerald-300/80 shadow-2xs transition-all cursor-pointer"
            title="Pengaturan Pos Anggaran, Instansi Pengguna Kas & Sumber Dana Keuangan"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Atur Pos & Sumber Dana</span>
          </button>
        )}
      </div>

      {/* Right: Real-time Bank Accounts Balance Glance & Role switch */}
      <div className="flex flex-wrap items-center gap-3">
        {/* BNI 1 Mini Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
              BNI Rekening 1
            </span>
            <span className="text-xs font-black text-[#064E3B]">
              {formatRupiah(bni1Balance)}
            </span>
          </div>
        </div>

        {/* BNI 2 Mini Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50/70 border border-teal-200/80 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-teal-600" />
          <div className="text-left">
            <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block">
              BNI Rekening 2
            </span>
            <span className="text-xs font-black text-teal-800">
              {formatRupiah(bni2Balance)}
            </span>
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Role:</span>
          <select
            id="role-switch-selector"
            aria-label="Pilih Role Pengguna"
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as any)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-1 focus:ring-[#064E3B]"
          >
            <option value="Bendahara">Bendahara (Full Input)</option>
            <option value="Administrator">Administrator (Audit & Cancel)</option>
            <option value="Pimpinan">Pimpinan (Oversight View)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
