import React from 'react';
import {
  CheckCircle2,
  Receipt,
  Calendar,
  User,
  ArrowRight,
  LayoutDashboard,
  FileSpreadsheet,
  Download,
  Share2,
  Printer,
} from 'lucide-react';
import { GenerateBillingConfig } from '../../types';

interface GenerateSuccessViewProps {
  config: GenerateBillingConfig;
  totalAkhir: number;
  totalDiskon: number;
  onNavigateToTagihan: () => void;
  onNavigateToDashboard: () => void;
}

export const GenerateSuccessView: React.FC<GenerateSuccessViewProps> = ({
  config,
  totalAkhir,
  totalDiskon,
  onNavigateToTagihan,
  onNavigateToDashboard,
}) => {
  const currentDateFormatted = '01 September 2026';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Success Card */}
      <div
        id="card-generate-success"
        className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-8 md:p-10 text-center space-y-6"
      >
        {/* Large Green Check Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 text-[#064E3B] mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-12 h-12 stroke-[2.2] text-[#064E3B]" />
        </div>

        {/* Title and Confirmation Text */}
        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-100/70 text-emerald-800 text-xs font-extrabold uppercase tracking-wider rounded-full">
            Status: Diterbitkan & Terkunci
          </span>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Tagihan Berhasil Dibuat!
          </h2>
          <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
            Sebanyak <strong className="text-[#0F172A] font-bold">300 tagihan santri</strong> untuk periode <strong className="text-[#064E3B] font-bold">{config.bulan}</strong> telah berhasil diterbitkan dan resmi tercatat ke dalam sistem piutang pesantren.
          </p>
        </div>

        {/* Transaction Summary Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Periode Penagihan:
            </span>
            <span className="font-bold text-[#0F172A]">{config.bulan} (TA {config.tahunAjaran})</span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-slate-400" />
              Total Nominal Tagihan:
            </span>
            <span className="font-black text-[#064E3B] text-sm">
              Rp {totalAkhir.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Total Potongan Diskon:</span>
            <span className={`font-bold ${totalDiskon > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {totalDiskon > 0 ? `Rp ${totalDiskon.toLocaleString('id-ID')}` : 'Rp 0'}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Tanggal Generate:</span>
            <span className="font-bold text-slate-700">{currentDateFormatted}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              Diterbitkan Oleh:
            </span>
            <span className="font-bold text-slate-800">Administrator (Admin Sistem)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            id="btn-success-print-proof"
            onClick={() => window.print()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Cetak Berita Acara Penerbitan Tagihan"
          >
            <Printer className="w-4 h-4 text-[#064E3B]" />
            <span>Cetak Berita Acara</span>
          </button>

          <button
            type="button"
            id="btn-success-to-dashboard"
            onClick={onNavigateToDashboard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>

          <button
            type="button"
            id="btn-success-to-tagihan"
            onClick={onNavigateToTagihan}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-sm active:scale-98"
          >
            <span>Lihat Tagihan Bulanan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
