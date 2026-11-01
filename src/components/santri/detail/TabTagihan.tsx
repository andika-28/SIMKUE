import React, { useState, useMemo } from 'react';
import {
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Calendar,
  Layers,
  Search,
  Tag,
} from 'lucide-react';
import { DetailedBill } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface TabTagihanProps {
  bills: DetailedBill[];
  onOpenBillDetail: (bill: DetailedBill) => void;
}

export const TabTagihan: React.FC<TabTagihanProps> = ({ bills, onOpenBillDetail }) => {
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('2026 / 2027');
  const [filterSemester, setFilterSemester] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      // 1. Tahun ajaran
      if (filterTahunAjaran !== 'ALL' && bill.tahunAjaran !== filterTahunAjaran) {
        return false;
      }
      // 2. Semester
      if (filterSemester !== 'ALL' && bill.semester && bill.semester !== filterSemester) {
        return false;
      }
      // 3. Status
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'LUNAS' && bill.status !== 'LUNAS') return false;
        if (filterStatus === 'BELUM LUNAS' && bill.status !== 'BELUM LUNAS') return false;
        if (filterStatus === 'MENUNGGU' && bill.status !== 'MENUNGGU') return false;
      }
      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPeriode = bill.periode.toLowerCase().includes(q);
        const matchRincian = bill.rincian.toLowerCase().includes(q);
        const matchJenis = bill.jenisTagihan.toLowerCase().includes(q);
        if (!matchPeriode && !matchRincian && !matchJenis) return false;
      }
      return true;
    });
  }, [bills, filterTahunAjaran, filterSemester, filterStatus, searchQuery]);

  const getStatusBadge = (status: DetailedBill['status']) => {
    switch (status) {
      case 'LUNAS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            LUNAS
          </span>
        );
      case 'BELUM LUNAS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            BELUM LUNAS
          </span>
        );
      case 'MENUNGGU':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            MENUNGGU
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden animate-in fade-in duration-150">
      
      {/* HEADER & FILTERS */}
      <div className="p-6 border-b border-[#E2E8F0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
            Daftar Tagihan
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Rincian tagihan bulanan dan tahunan santri per semester.
          </p>
        </div>

        {/* Right side filter toolbars */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Filter Tahun Ajaran */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#64748B] font-medium hidden sm:inline">T.A:</span>
            <select
              value={filterTahunAjaran}
              onChange={(e) => setFilterTahunAjaran(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#334155] font-semibold focus:outline-none focus:border-[#064E3B] focus:bg-white"
            >
              <option value="2026 / 2027">2026 / 2027</option>
              <option value="2025 / 2026">2025 / 2026</option>
              <option value="ALL">Semua T.A</option>
            </select>
          </div>

          {/* Filter Semester */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#64748B] font-medium hidden sm:inline">Semester:</span>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#334155] font-semibold focus:outline-none focus:border-[#064E3B] focus:bg-white"
            >
              <option value="ALL">Semua Semester</option>
              <option value="Semester Ganjil">Semester Ganjil</option>
              <option value="Semester Genap">Semester Genap</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#64748B] font-medium hidden sm:inline">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#334155] font-semibold focus:outline-none focus:border-[#064E3B] focus:bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="LUNAS">LUNAS</option>
              <option value="BELUM LUNAS">BELUM LUNAS</option>
              <option value="MENUNGGU">MENUNGGU</option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Periode</th>
              <th className="py-3.5 px-4">Jenis Tagihan</th>
              <th className="py-3.5 px-4">Rincian</th>
              <th className="py-3.5 px-4 text-right">Nominal</th>
              <th className="py-3.5 px-4 text-right">Diskon</th>
              <th className="py-3.5 px-4 text-right">Total Akhir</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Tidak ada tagihan yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => {
                const hasDiscount = bill.diskon > 0;

                return (
                  <tr
                    key={bill.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* Periode */}
                    <td className="py-3.5 px-4 font-semibold text-[#1E293B] whitespace-nowrap">
                      {bill.periode}
                    </td>

                    {/* Jenis Tagihan */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          bill.jenisTagihan === 'Tagihan Bulanan'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {bill.jenisTagihan}
                      </span>
                    </td>

                    {/* Rincian */}
                    <td className="py-3.5 px-4 text-[#475569] max-w-xs truncate">
                      {bill.rincian}
                    </td>

                    {/* Nominal */}
                    <td className="py-3.5 px-4 text-right font-mono text-[#64748B]">
                      {formatRupiah(bill.nominal)}
                    </td>

                    {/* Diskon */}
                    <td className="py-3.5 px-4 text-right">
                      {hasDiscount ? (
                        <span className="font-mono text-emerald-700 font-bold inline-flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          -{formatRupiah(bill.diskon)}
                        </span>
                      ) : (
                        <span className="font-mono text-[#94A3B8]">Rp0</span>
                      )}
                    </td>

                    {/* Total Akhir */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1E293B]">
                      {formatRupiah(bill.totalAkhir)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(bill.status)}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenBillDetail(bill)}
                        className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-white hover:bg-emerald-50 hover:border-[#064E3B] hover:text-[#064E3B] text-[#334155] font-semibold text-[11px] inline-flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#064E3B]" />
                        <span>Lihat Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER NOTE */}
      <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
        <span>
          Menampilkan <strong>{filteredBills.length}</strong> tagihan santri.
        </span>
        <span className="text-[11px] text-[#064E3B] font-semibold">
          💡 Catatan: Tagihan bulanan santri harus dibayar penuh (tanpa cicilan parsial).
        </span>
      </div>

    </div>
  );
};
