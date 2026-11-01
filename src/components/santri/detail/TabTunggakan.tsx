import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  CreditCard,
  Printer,
  Calendar,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { DetailedBill, Student } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface TabTunggakanProps {
  student: Student;
  bills: DetailedBill[];
  onOpenBillDetail: (bill: DetailedBill) => void;
  onSendWhatsAppReminder: () => void;
  onQuickPayArrears: () => void;
}

export const TabTunggakan: React.FC<TabTunggakanProps> = ({
  student,
  bills,
  onOpenBillDetail,
  onSendWhatsAppReminder,
  onQuickPayArrears,
}) => {
  // Arrears bills
  const unpaidBills = bills.filter((b) => b.tunggakan > 0);
  const totalTunggakan = unpaidBills.reduce((acc, b) => acc + b.tunggakan, 0) || 850000;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. PROMINENT WARNING SUMMARY CARD */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
              Tunggakan Santri
            </span>
            <div className="text-3xl font-black text-amber-950 mt-0.5 font-mono">
              {formatRupiah(totalTunggakan)}
            </div>
            <p className="text-xs text-amber-900 mt-1">
              Santri <strong className="font-semibold text-amber-950">{student.nama}</strong> memiliki kewajiban yang belum diselesaikan untuk periode aktif.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status Badge */}
          <div className="text-center sm:text-right px-4 py-2 bg-amber-100/90 border border-amber-300 rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
              Status Tagihan
            </span>
            <span className="text-xs font-extrabold text-amber-950">
              PERLU DISELESAIKAN
            </span>
          </div>

          {/* Quick Pay Action */}
          <button
            onClick={onQuickPayArrears}
            className="px-4 py-2.5 rounded-lg bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs active:scale-98"
          >
            <CreditCard className="w-4 h-4" />
            <span>Bayar Sekarang</span>
          </button>
        </div>
      </div>

      {/* 2. TABLE OF ARREARS */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E293B] tracking-tight">
              Rincian Item Tunggakan
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Daftar tagihan yang telah melampaui atau mendekati batas jatuh tempo.
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {unpaidBills.length} Item Belum Lunas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Periode</th>
                <th className="py-3.5 px-4">Jenis Tagihan</th>
                <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                <th className="py-3.5 px-4 text-right">Sudah Dibayar</th>
                <th className="py-3.5 px-4 text-right">Tunggakan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {unpaidBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-emerald-700 font-medium">
                    ✓ Tidak ada tunggakan. Seluruh tagihan telah lunas.
                  </td>
                </tr>
              ) : (
                unpaidBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-amber-50/30 transition">
                    <td className="py-3.5 px-4 font-bold text-[#1E293B] whitespace-nowrap">
                      {bill.periode}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {bill.jenisTagihan} ({bill.rincian})
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#64748B]">
                      {formatRupiah(bill.totalAkhir)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700">
                      {formatRupiah(bill.terbayar)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-700">
                      {formatRupiah(bill.tunggakan)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        BELUM LUNAS
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenBillDetail(bill)}
                        className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-white hover:bg-emerald-50 hover:text-[#064E3B] text-[#334155] font-semibold text-[11px] transition shadow-2xs"
                      >
                        Detail Tagihan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM TOTAL SUMMARY BOX */}
        <div className="p-4 bg-amber-50/50 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              TOTAL TUNGGAKAN
            </span>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-rose-700 font-mono">
              {formatRupiah(totalTunggakan)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. GUARDIAN NOTIFICATION & FOLLOW-UP ACTION */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Tindak Lanjut Wali Santri
          </h4>
          <p className="text-xs text-[#64748B] mt-0.5">
            Kirim surat tagihan atau pesan konfirmasi otomatis langsung ke WhatsApp wali ({student.namaWali} - {student.noHpWali}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSendWhatsAppReminder}
            className="px-3.5 py-2 rounded-lg border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] font-bold text-xs flex items-center gap-2 transition active:scale-98"
          >
            <MessageSquare className="w-4 h-4 text-[#064E3B]" />
            <span>Kirim Pengingat WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
};
