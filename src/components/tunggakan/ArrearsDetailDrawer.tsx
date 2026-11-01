import React from 'react';
import {
  X,
  User,
  Phone,
  MessageSquare,
  Copy,
  ExternalLink,
  Printer,
  Calendar,
  AlertTriangle,
  Receipt,
  GraduationCap,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { StudentArrearItem } from '../../types';

interface ArrearsDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  arrearItem: StudentArrearItem | null;
  onNavigateToStudentDetail?: (studentId: string) => void;
  onSendWhatsapp: (item: StudentArrearItem) => void;
  onCopyPhone: (phone: string) => void;
  onPrintInvoice: (item: StudentArrearItem) => void;
}

export const ArrearsDetailDrawer: React.FC<ArrearsDetailDrawerProps> = ({
  isOpen,
  onClose,
  arrearItem,
  onNavigateToStudentDetail,
  onSendWhatsapp,
  onCopyPhone,
  onPrintInvoice,
}) => {
  if (!isOpen || !arrearItem) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="drawer-arrears-detail"
          className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200"
        >
          {/* Drawer Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {arrearItem.namaSantri.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {arrearItem.namaSantri}
                  </h3>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      arrearItem.unit === 'MTs'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {arrearItem.unit}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>NIS: <strong className="text-slate-800 font-mono">{arrearItem.nis}</strong></span>
                  <span>•</span>
                  <span>{arrearItem.kelas}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{arrearItem.statusSantri}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-arrears-drawer"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Guardian & Contact Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Informasi Wali Santri
                </span>
                <span className="text-[11px] text-slate-500">
                  Paket Makan: <strong className="text-slate-800 font-bold">{arrearItem.paketMakan || 'Paket C'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Nama Wali:</span>
                  <span className="font-bold text-slate-900">{arrearItem.namaWali}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">No. HP / WhatsApp:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 font-mono">
                    <span>{arrearItem.noHpWali}</span>
                    <button
                      type="button"
                      onClick={() => onCopyPhone(arrearItem.noHpWali)}
                      title="Salin No. HP"
                      className="p-1 text-slate-400 hover:text-[#064E3B] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {arrearItem.alamat && (
                <div className="text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400 font-medium">Alamat: </span>
                  {arrearItem.alamat}
                </div>
              )}
            </div>

            {/* Prominent TOTAL ARREARS Formula Card */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-100 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-200" />
                    Total Tunggakan Aktif
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-rose-800">
                    {arrearItem.kategori}
                  </span>
                </div>

                <h2 className="text-3xl font-black tracking-tight">
                  {formatRupiah(arrearItem.totalTunggakan)}
                </h2>

                {/* Arithmetic Breakdown Formula */}
                <div className="mt-3 pt-3 border-t border-rose-400/40 text-xs text-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-semibold">Bulanan: </span>
                    <span className="font-black text-white">{formatRupiah(arrearItem.tunggakanBulanan)}</span>
                  </div>
                  <span className="text-rose-300 font-bold hidden sm:inline">+</span>
                  <div>
                    <span className="font-semibold">Tahunan: </span>
                    <span className="font-black text-white">{formatRupiah(arrearItem.tunggakanTahunan)}</span>
                  </div>
                  <span className="text-rose-300 font-bold hidden sm:inline">=</span>
                  <div className="font-extrabold text-white bg-rose-900/40 px-2 py-0.5 rounded border border-rose-400/30">
                    {formatRupiah(arrearItem.totalTunggakan)}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: Tunggakan Bulanan Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-600" />
                  <span>Rincian Tunggakan Bulanan</span>
                </h4>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Total: {formatRupiah(arrearItem.tunggakanBulanan)}
                </span>
              </div>

              {arrearItem.rincianBulanan.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  Tidak ada tunggakan bulanan aktif.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Periode</th>
                        <th className="py-2.5 px-2 text-right">SPP</th>
                        <th className="py-2.5 px-2 text-right">Makan</th>
                        <th className="py-2.5 px-2 text-right">Listrik</th>
                        <th className="py-2.5 px-3 text-right font-black text-rose-900">Total</th>
                        <th className="py-2.5 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {arrearItem.rincianBulanan.map((rb, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{rb.periode}</td>
                          <td className="py-2.5 px-2 text-right">{formatRupiah(rb.spp)}</td>
                          <td className="py-2.5 px-2 text-right">{formatRupiah(rb.uangMakan)}</td>
                          <td className="py-2.5 px-2 text-right">{formatRupiah(rb.listrikAir)}</td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-rose-700">
                            {formatRupiah(rb.total)}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800">
                              BELUM LUNAS
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SECTION 2: Sisa Tagihan Tahunan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Sisa Tagihan Tahunan (Cicilan)</span>
                </h4>
                <span className="text-xs font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Total Sisa: {formatRupiah(arrearItem.tunggakanTahunan)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Uang Pembangunan */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Pembangunan
                  </span>
                  <div className="text-xs text-slate-600">
                    <div>Total: <span className="font-semibold text-slate-900">{formatRupiah(arrearItem.rincianTahunan.pembangunan.total)}</span></div>
                    <div>Dibayar: <span className="font-semibold text-emerald-700">{formatRupiah(arrearItem.rincianTahunan.pembangunan.sudahDibayar)}</span></div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-xs font-extrabold text-orange-700">
                    Sisa: {formatRupiah(arrearItem.rincianTahunan.pembangunan.sisa)}
                  </div>
                </div>

                {/* Uang Kertas */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Uang Kertas
                  </span>
                  <div className="text-xs text-slate-600">
                    <div>Total: <span className="font-semibold text-slate-900">{formatRupiah(arrearItem.rincianTahunan.kertas.total)}</span></div>
                    <div>Dibayar: <span className="font-semibold text-emerald-700">{formatRupiah(arrearItem.rincianTahunan.kertas.sudahDibayar)}</span></div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-xs font-extrabold text-orange-700">
                    Sisa: {formatRupiah(arrearItem.rincianTahunan.kertas.sisa)}
                  </div>
                </div>

                {/* Uang Kegiatan */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Uang Kegiatan
                  </span>
                  <div className="text-xs text-slate-600">
                    <div>Total: <span className="font-semibold text-slate-900">{formatRupiah(arrearItem.rincianTahunan.kegiatan.total)}</span></div>
                    <div>Dibayar: <span className="font-semibold text-emerald-700">{formatRupiah(arrearItem.rincianTahunan.kegiatan.sudahDibayar)}</span></div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-xs font-extrabold text-orange-700">
                    Sisa: {formatRupiah(arrearItem.rincianTahunan.kegiatan.sisa)}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Timeline Riwayat Akumulasi */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Riwayat & Timeline Penagihan</span>
              </h4>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                {arrearItem.timelineRiwayat.map((tl, index) => (
                  <div key={tl.id} className="flex items-start gap-3 relative">
                    {index < arrearItem.timelineRiwayat.length - 1 && (
                      <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-200 -z-0" />
                    )}
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5 z-10">
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{tl.periode}</span>
                        <span className="text-[10px] text-slate-400">{tl.tanggal}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{tl.keterangan}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                        {tl.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Sticky Footer Actions */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-drawer-send-wa"
                onClick={() => onSendWhatsapp(arrearItem)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Kirim Notifikasi WA</span>
              </button>

              <button
                type="button"
                id="btn-drawer-print-invoice"
                onClick={() => onPrintInvoice(arrearItem)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all shadow-2xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rincian</span>
              </button>
            </div>

            {onNavigateToStudentDetail && (
              <button
                type="button"
                id="btn-drawer-goto-student-profile"
                onClick={() => {
                  onClose();
                  onNavigateToStudentDetail(arrearItem.nis);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Lihat Detail Keuangan Santri</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
