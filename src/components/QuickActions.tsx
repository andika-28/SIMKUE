import React from 'react';
import {
  PlusCircle,
  MinusCircle,
  FileSpreadsheet,
  UploadCloud,
  Zap,
} from 'lucide-react';

interface QuickActionsProps {
  onOpenModal: (actionType: 'pemasukan' | 'pengeluaran' | 'tagihan' | 'import') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenModal }) => {
  return (
    <section id="quick-actions-bar" className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E293B] leading-tight">
              Aksi Cepat
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Pintasan transaksi & administrasi harian bendahara
            </p>
          </div>
        </div>

        {/* 4 Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 max-w-2xl">
          {/* 1. Tambah Pemasukan */}
          <button
            id="btn-quick-pemasukan"
            onClick={() => onOpenModal('pemasukan')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs hover:shadow transition-all group active:scale-98"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200 group-hover:scale-105 transition-transform" />
            <span className="truncate">Tambah Pemasukan</span>
          </button>

          {/* 2. Catat Pengeluaran */}
          <button
            id="btn-quick-pengeluaran"
            onClick={() => onOpenModal('pengeluaran')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#1E293B] hover:bg-slate-900 text-white text-xs font-semibold shadow-xs hover:shadow transition-all group active:scale-98"
          >
            <MinusCircle className="w-4 h-4 text-slate-300 group-hover:scale-105 transition-transform" />
            <span className="truncate">Catat Pengeluaran</span>
          </button>

          {/* 3. Generate Tagihan */}
          <button
            id="btn-quick-tagihan"
            onClick={() => onOpenModal('tagihan')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] text-xs font-semibold shadow-xs transition-all group active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#064E3B] group-hover:scale-105 transition-transform" />
            <span className="truncate">Generate Tagihan</span>
          </button>

          {/* 4. Import Pembayaran */}
          <button
            id="btn-quick-import"
            onClick={() => onOpenModal('import')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] text-xs font-semibold shadow-xs transition-all group active:scale-98"
          >
            <UploadCloud className="w-4 h-4 text-blue-600 group-hover:scale-105 transition-transform" />
            <span className="truncate">Import Pembayaran</span>
          </button>
        </div>
      </div>
    </section>
  );
};
