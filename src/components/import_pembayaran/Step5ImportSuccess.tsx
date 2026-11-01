import React from 'react';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
  Eye,
  AlertTriangle,
  Receipt,
  Wallet,
  Calendar,
  Layers,
  Check,
  TrendingDown,
  Landmark,
  FileText,
} from 'lucide-react';

interface Step5ImportSuccessProps {
  onResetImport: () => void;
  onViewProblems: () => void;
  onNavigateToReports?: () => void;
  onNavigateToTunggakan?: () => void;
  onDownloadReportPdf: () => void;
  totalProcessed?: number;
  totalNominal?: number;
  monthlyPaidCount?: number;
  annualPaidCount?: number;
  problemCount?: number;
}

export const Step5ImportSuccess: React.FC<Step5ImportSuccessProps> = ({
  onResetImport,
  onViewProblems,
  onNavigateToReports,
  onNavigateToTunggakan,
  onDownloadReportPdf,
  totalProcessed = 1220,
  totalNominal = 325500000,
  monthlyPaidCount = 850,
  annualPaidCount = 370,
  problemCount = 25,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const systemUpdates = [
    { label: 'Status Tagihan Santri', desc: 'Tagihan bulanan santri bersangkutan otomatis berstatus LUNAS' },
    { label: 'Riwayat Pembayaran', desc: 'Dicatatkan ke ledger pembayaran santri per semester & TA' },
    { label: 'Total Pemasukan', desc: 'Menambah kas masuk bulan Agustus 2026' },
    { label: 'Saldo Bank', desc: 'Rekonsiliasi rekening kas BNI bertambah real-time' },
    { label: 'Dashboard Keuangan', desc: 'Grafik penerimaan & KPI keuangan terupdate' },
    { label: 'Tunggakan Santri', desc: 'Saldo piutang santri otomatis berkurang' },
    { label: 'Laporan Harian', desc: 'Tercatat di buku pembantu kas harian pesantren' },
    { label: 'Laporan Bulanan', desc: 'Teragregasi dalam laporan neraca Agustus' },
    { label: 'Detail Keuangan Santri', desc: 'Kwitansi & kartu iuran santri siap dicetak' },
  ];

  return (
    <div id="step-5-import-success" className="space-y-6">
      {/* Success Celebration Banner */}
      <div className="bg-white rounded-2xl border border-emerald-300 p-8 shadow-xs text-center relative overflow-hidden bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="w-20 h-20 rounded-3xl bg-[#064E3B] text-white flex items-center justify-center mx-auto shadow-md mb-4 border-4 border-emerald-100 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Import Pembayaran Berhasil
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
          <strong className="text-[#064E3B] font-black">{totalProcessed.toLocaleString('id-ID')} transaksi pembayaran</strong> berhasil diproses dan direkonsiliasi ke dalam sistem SIMKEU.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
          <span>Batch ID: <strong className="text-slate-800 font-bold">IMP-20260831-001</strong></span>
          <span>•</span>
          <span>Waktu: 31 Agustus 2026, 09:42 WIB</span>
        </div>
      </div>

      {/* SUCCESS SUMMARY METRICS (6 Grid Items) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Transaksi Diproses
          </span>
          <h4 className="text-lg font-black text-slate-900 mt-1">
            {totalProcessed.toLocaleString('id-ID')}
          </h4>
          <span className="text-[10px] text-emerald-700 font-bold">100% Berhasil</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Total Nominal
          </span>
          <h4 className="text-lg font-black text-[#064E3B] mt-1 truncate">
            {formatRupiah(totalNominal)}
          </h4>
          <span className="text-[10px] text-emerald-700 font-bold">Kas Bertambah</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tagihan Bulanan Lunas
          </span>
          <h4 className="text-lg font-black text-slate-900 mt-1">
            {monthlyPaidCount}
          </h4>
          <span className="text-[10px] text-slate-500">SPP & Konsumsi</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pembayaran Tahunan
          </span>
          <h4 className="text-lg font-black text-slate-900 mt-1">
            {annualPaidCount}
          </h4>
          <span className="text-[10px] text-slate-500">Pembangunan/Kertas</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tunggakan Berkurang
          </span>
          <h4 className="text-lg font-black text-emerald-700 mt-1 truncate">
            {formatRupiah(totalNominal)}
          </h4>
          <span className="text-[10px] text-emerald-700 font-bold">Piutang Terbayar</span>
        </div>

        {/* Metric 6: Masalah */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Bermasalah
            </span>
            <h4 className="text-lg font-black text-amber-900 mt-1">
              {problemCount}
            </h4>
          </div>
          <button
            type="button"
            onClick={onViewProblems}
            className="text-[10px] font-bold text-amber-800 hover:text-amber-950 underline text-left cursor-pointer mt-1"
          >
            Lihat Transaksi →
          </button>
        </div>
      </div>

      {/* AUTOMATIC SYSTEM UPDATE CHECKLIST */}
      <div
        id="card-automatic-system-updates"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Pembaruan Sistem Keuangan Otomatis (Live Synchronized)
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh modul keuangan pesantren berikut telah diperbarui secara real-time
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200">
            9 Modul Tersinkronisasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {systemUpdates.map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-slate-900">{item.label}</h5>
                <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUCCESS ACTIONS FOOTER */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          id="btn-import-another-file"
          onClick={onResetImport}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Import File Pembayaran Baru</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            id="btn-download-import-report-pdf"
            onClick={onDownloadReportPdf}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-[#064E3B] font-bold rounded-xl border border-emerald-300 text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan Berita Acara (.PDF)</span>
          </button>

          <button
            type="button"
            id="btn-goto-arrears"
            onClick={onNavigateToTunggakan}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white font-black rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Lihat Data Tunggakan Terupdate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
