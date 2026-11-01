import React from 'react';
import {
  Download,
  Eye,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  Building,
  CreditCard,
} from 'lucide-react';
import { DetailedPayment } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface TabRiwayatPembayaranProps {
  payments: DetailedPayment[];
  onOpenPaymentReceipt: (payment: DetailedPayment) => void;
  onExportHistory: () => void;
}

export const TabRiwayatPembayaran: React.FC<TabRiwayatPembayaranProps> = ({
  payments,
  onOpenPaymentReceipt,
  onExportHistory,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden animate-in fade-in duration-150">
      
      {/* HEADER */}
      <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
            Riwayat Pembayaran
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Seluruh pembayaran yang tercatat untuk santri ini.
          </p>
        </div>

        {/* Right side: Button Export Riwayat */}
        <button
          id="btn-export-riwayat"
          onClick={onExportHistory}
          className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] font-semibold text-xs flex items-center gap-2 transition shadow-2xs active:scale-98"
        >
          <Download className="w-4 h-4 text-[#064E3B]" />
          <span>Export Riwayat</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Tanggal</th>
              <th className="py-3.5 px-4">No. Referensi</th>
              <th className="py-3.5 px-4">Jenis Pembayaran</th>
              <th className="py-3.5 px-4">Periode</th>
              <th className="py-3.5 px-4 text-right">Nominal</th>
              <th className="py-3.5 px-4">Metode / Sumber</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-slate-50/80 transition group"
              >
                {/* Tanggal */}
                <td className="py-3.5 px-4 font-semibold text-[#1E293B] whitespace-nowrap">
                  {payment.tanggal}
                </td>

                {/* No Referensi */}
                <td className="py-3.5 px-4 font-mono text-[#064E3B] font-semibold whitespace-nowrap">
                  {payment.noReferensi}
                </td>

                {/* Jenis Pembayaran */}
                <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                  {payment.jenisPembayaran}
                </td>

                {/* Periode */}
                <td className="py-3.5 px-4 text-[#64748B] whitespace-nowrap">
                  {payment.periode}
                </td>

                {/* Nominal */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-[#064E3B] whitespace-nowrap">
                  {formatRupiah(payment.nominal)}
                </td>

                {/* Metode / Sumber */}
                <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{payment.sumber}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {payment.status}
                  </span>
                </td>

                {/* Aksi: [ Lihat ] */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <button
                    onClick={() => onOpenPaymentReceipt(payment)}
                    className="px-3 py-1 rounded-lg border border-[#CBD5E1] bg-white hover:bg-emerald-50 hover:border-[#064E3B] hover:text-[#064E3B] text-[#334155] font-semibold text-[11px] inline-flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>Lihat</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
        <span>Total {payments.length} transaksi penerimaan tersinkronisasi.</span>
        <span className="font-mono font-semibold text-[#064E3B]">
          Total Diterima: {formatRupiah(payments.reduce((acc, p) => acc + p.nominal, 0))}
        </span>
      </div>

    </div>
  );
};
