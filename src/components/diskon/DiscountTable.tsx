import React, { useState } from 'react';
import {
  Eye,
  Edit,
  MoreVertical,
  Tag,
  CheckCircle2,
  Clock,
  Ban,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Sparkles,
  Plus,
} from 'lucide-react';
import { BillingDiscount, DiscountStatus } from '../../types';

interface DiscountTableProps {
  discounts: BillingDiscount[];
  onViewDetail: (discount: BillingDiscount) => void;
  onEditDiscount: (discount: BillingDiscount) => void;
  onToggleStatus?: (discount: BillingDiscount, newStatus: DiscountStatus) => void;
  onOpenAdjustmentModal: (discount: BillingDiscount) => void;
  onOpenCreateModal: () => void;
}

export const DiscountTable: React.FC<DiscountTableProps> = ({
  discounts,
  onViewDetail,
  onEditDiscount,
  onToggleStatus,
  onOpenAdjustmentModal,
  onOpenCreateModal,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const getStatusBadge = (status: DiscountStatus) => {
    switch (status) {
      case 'AKTIF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            AKTIF
          </span>
        );
      case 'SUDAH DITERAPKAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            SUDAH DITERAPKAN
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            DRAFT
          </span>
        );
      case 'DIBATALKAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
            <Ban className="w-3 h-3 text-rose-600" />
            DIBATALKAN
          </span>
        );
    }
  };

  const getJenisTagihanBadge = (jenis: string) => {
    switch (jenis) {
      case 'Uang Makan':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Uang Makan
          </span>
        );
      case 'SPP':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            SPP
          </span>
        );
      case 'Listrik & Air':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
            Listrik & Air
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
            {jenis}
          </span>
        );
    }
  };

  if (discounts.length === 0) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
          <Tag className="w-8 h-8 text-[#064E3B]" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h4 className="text-base font-bold text-slate-800">
            Belum Ada Diskon
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Belum ada konfigurasi diskon untuk periode yang dipilih atau filter yang Anda terapkan.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Diskon Baru</span>
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 px-3.5 text-center w-12">No</th>
            <th className="py-3 px-3.5 min-w-[100px]">Periode</th>
            <th className="py-3 px-3.5 min-w-[200px]">Nama Diskon</th>
            <th className="py-3 px-3.5 min-w-[120px]">Jenis Tagihan</th>
            <th className="py-3 px-3.5 min-w-[130px]">Target</th>
            <th className="py-3 px-3.5 text-right min-w-[130px]">Nominal Diskon</th>
            <th className="py-3 px-3.5 text-center min-w-[130px]">Santri Terdampak</th>
            <th className="py-3 px-3.5 text-center min-w-[120px]">Status</th>
            <th className="py-3 px-3.5 min-w-[120px]">Dibuat Oleh</th>
            <th className="py-3 px-3.5 min-w-[100px]">Tanggal</th>
            <th className="py-3 px-3.5 text-center w-28">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
          {discounts.map((item, index) => {
            const isMenuOpen = activeMenuId === item.id;

            return (
              <tr
                key={item.id}
                id={`row-discount-${item.id}`}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* 1. No */}
                <td className="py-3.5 px-3.5 text-center font-bold text-slate-400">
                  {index + 1}
                </td>

                {/* 2. Periode */}
                <td className="py-3.5 px-3.5 whitespace-nowrap">
                  <span className="font-bold text-slate-900 block">
                    {item.periode}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.tahunAjaran}
                  </span>
                </td>

                {/* 3. Nama Diskon */}
                <td className="py-3.5 px-3.5">
                  <div className="font-bold text-[#0F172A] group-hover:text-[#064E3B] transition-colors line-clamp-1">
                    {item.namaDiskon}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.alasan}
                  </div>
                </td>

                {/* 4. Jenis Tagihan */}
                <td className="py-3.5 px-3.5 whitespace-nowrap">
                  {getJenisTagihanBadge(item.jenisTagihan)}
                </td>

                {/* 5. Target */}
                <td className="py-3.5 px-3.5 whitespace-nowrap">
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                    {item.targetDetail}
                  </span>
                </td>

                {/* 6. Nominal Diskon */}
                <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                  <span className="font-extrabold text-[#064E3B] text-xs">
                    {formatRupiah(item.nominalDiskon)}
                  </span>
                  {item.tipeDiskon === 'Persentase' && item.persentaseDiskon && (
                    <span className="text-[10px] text-slate-500 block">
                      ({item.persentaseDiskon}%)
                    </span>
                  )}
                </td>

                {/* 7. Santri Terdampak */}
                <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {item.santriTerdampakCount} Santri
                  </span>
                </td>

                {/* 8. Status */}
                <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>

                {/* 9. Dibuat Oleh */}
                <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-600 text-xs">
                  {item.dibuatOleh}
                </td>

                {/* 10. Tanggal */}
                <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-500 text-xs">
                  {item.tanggalDibuat}
                </td>

                {/* 11. Actions */}
                <td className="py-3.5 px-3.5 text-center whitespace-nowrap relative">
                  <div className="flex items-center justify-center gap-1">
                    {/* Eye Action: View Detail */}
                    <button
                      type="button"
                      id={`btn-view-discount-${item.id}`}
                      onClick={() => onViewDetail(item)}
                      title="Lihat Detail Diskon"
                      className="p-1.5 text-slate-500 hover:text-[#064E3B] hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Action */}
                    <button
                      type="button"
                      id={`btn-edit-discount-${item.id}`}
                      onClick={() => onEditDiscount(item)}
                      title="Edit Diskon"
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* More Menu Trigger */}
                    <div className="relative">
                      <button
                        type="button"
                        id={`btn-menu-discount-${item.id}`}
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : item.id)
                        }
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Popup */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-50 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-left text-xs animate-in fade-in-50 zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                onViewDetail(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-[#064E3B] flex items-center gap-2 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>Lihat Detail Lengkap</span>
                            </button>

                            {item.isBillingGenerated ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenAdjustmentModal(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-medium"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                                <span>Buat Penyesuaian</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onEditDiscount(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit Diskon</span>
                              </button>
                            )}

                            {onToggleStatus && item.status !== 'AKTIF' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onToggleStatus(item, 'AKTIF');
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Aktifkan Diskon</span>
                              </button>
                            )}

                            {onToggleStatus && item.status === 'AKTIF' && !item.isBillingGenerated && (
                              <button
                                type="button"
                                onClick={() => {
                                  onToggleStatus(item, 'DIBATALKAN');
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span>Batalkan Diskon</span>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
