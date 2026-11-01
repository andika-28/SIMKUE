import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  Eye,
  Check,
  X,
  Sliders,
  Sparkles,
  Info,
  Filter,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { UserRoleType, ModulePermissionItem, PermissionLevel } from '../../types';

interface RoleMatrixTabProps {
  permissions: ModulePermissionItem[];
  onOpenPermissionEditor: (role: UserRoleType) => void;
}

export const RoleMatrixTab: React.FC<RoleMatrixTabProps> = ({
  permissions,
  onOpenPermissionEditor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  const filteredPermissions = permissions.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  const renderLevelIndicator = (level: PermissionLevel, customText?: string) => {
    switch (level) {
      case 'full':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
            <Check className="h-3.5 w-3.5 text-emerald-700" />
            <span>{customText || 'Full Access'}</span>
          </div>
        );
      case 'limited':
      case 'own_only':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100/80 text-amber-800 border border-amber-200">
            <span className="text-amber-700 font-black text-sm leading-none">◐</span>
            <span>{customText || (level === 'own_only' ? 'Transaksi Sendiri' : 'Limited')}</span>
          </div>
        );
      case 'view_only':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100/80 text-blue-800 border border-blue-200">
            <Eye className="h-3.5 w-3.5 text-blue-700" />
            <span>{customText || 'View Only'}</span>
          </div>
        );
      case 'none':
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200/60">
            <X className="h-3.5 w-3.5 text-slate-300" />
            <span>{customText || 'No Access'}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            Role & Hak Akses (Role-Based Access Control)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Atur hak akses terperinci setiap role terhadap fitur transaksi, basis data, dan modul laporan keuangan.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 px-1">Indikator:</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Check className="h-3 w-3 text-emerald-600" /> Full Access
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            ◐ Limited / Own
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Eye className="h-3 w-3 text-blue-600" /> View Only
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <X className="h-3 w-3 text-slate-400" /> No Access
          </span>
        </div>
      </div>

      {/* 3 Prominent Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Role 1: Administrator */}
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-6 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none opacity-60"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                Full Access
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">Administrator</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Memiliki akses penuh untuk mengelola sistem, data santri, konfigurasi tagihan, pengguna, dan otorisasi perbankan.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Akses 100% seluruh modul
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Otoritas pembatalan & audit
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 relative z-10">
            <button
              onClick={() => onOpenPermissionEditor('Administrator')}
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sliders className="h-4 w-4" />
              Kelola Hak Akses Administrator
            </button>
          </div>
        </div>

        {/* Role 2: Bendahara */}
        <div className="bg-white rounded-2xl border border-blue-200 shadow-xs p-6 flex flex-col justify-between relative overflow-hidden group hover:border-blue-400 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-50 rounded-bl-full -z-0 pointer-events-none opacity-60"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                Financial Access
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">Bendahara</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mengelola transaksi operasional harian keuangan, kas masuk santri, entri pengeluaran kas, mutasi rekening, dan laporan.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Input kas masuk & belanja pesantren
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Lock className="h-3.5 w-3.5 text-slate-400" /> Terkunci: Pengaturan user & sistem
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 relative z-10">
            <button
              onClick={() => onOpenPermissionEditor('Bendahara')}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sliders className="h-4 w-4" />
              Kelola Hak Akses Bendahara
            </button>
          </div>
        </div>

        {/* Role 3: Pimpinan */}
        <div className="bg-white rounded-2xl border border-purple-200 shadow-xs p-6 flex flex-col justify-between relative overflow-hidden group hover:border-purple-400 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-50 rounded-bl-full -z-0 pointer-events-none opacity-60"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                <Eye className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                Read Only Oversight
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">Pimpinan Pesantren</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Memantau kondisi kesehatan fiskal, saldo kas bank, audit pengeluaran, serta validasi laporan resmi tanpa memodifikasi transaksi.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-800 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" /> Monitoring realtime & export PDF
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Lock className="h-3.5 w-3.5 text-slate-400" /> Mode aman: Tidak mengubah transaksi
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 relative z-10">
            <button
              onClick={() => onOpenPermissionEditor('Pimpinan')}
              className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sliders className="h-4 w-4" />
              Kelola Hak Akses Pimpinan
            </button>
          </div>
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-700" />
              Matriks Izin Modul Lengkap (Detailed Permission Matrix)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan izin hak akses tiap fungsi aplikasi untuk masing-masing role.
            </p>
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="all">Semua Kategori Modul</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Modul {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-1/3">Fitur & Modul Sistem</th>
                <th className="py-3 px-4 text-center w-1/5">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Administrator
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-1/5">
                  <div className="flex items-center justify-center gap-1.5 text-blue-800 font-bold">
                    <Wallet className="h-3.5 w-3.5" />
                    Bendahara
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-1/5">
                  <div className="flex items-center justify-center gap-1.5 text-purple-800 font-bold">
                    <Eye className="h-3.5 w-3.5" />
                    Pimpinan
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPermissions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderLevelIndicator(item.adminLevel, item.adminText)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderLevelIndicator(item.bendaharaLevel, item.bendaharaText)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderLevelIndicator(item.pimpinanLevel, item.pimpinanText)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Summary Comparison Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            Ringkasan & Batasan Tanggung Jawab Role
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Panduan pembagian tugas dan batas kewenangan akun pada ekosistem keuangan SIMKEU.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card Admin */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-800 text-sm">Administrator</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Pengelola Sistem
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                ✓ Dapat Melakukan:
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li>Kelola seluruh akun & reset password</li>
                <li>Konfigurasi tarif tagihan santri</li>
                <li>Pembatalan transaksi salah/ganda</li>
                <li>Penyesuaian saldo rekening & bank</li>
                <li>Pengaturan data identitas pesantren</li>
              </ul>
            </div>
          </div>

          {/* Card Bendahara */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-800 text-sm">Bendahara</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Pengelola Keuangan
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                ✓ Dapat Melakukan:
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li>Validasi kas masuk pembayaran SPP</li>
                <li>Import mutasi rekening koran BNI</li>
                <li>Pencatatan kas keluar belanja dapur & honor</li>
                <li>Cetak kwitansi pembayaran sah</li>
                <li>Generate seluruh laporan keuangan</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                ✕ Batasan Akses:
              </span>
              <ul className="space-y-1 text-slate-500 list-disc list-inside">
                <li>Tidak dapat membuat/edit user lain</li>
                <li>Tidak dapat mengubah pengaturan instansi</li>
                <li>Tidak dapat menghapus permanen riwayat</li>
              </ul>
            </div>
          </div>

          {/* Card Pimpinan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-800 text-sm">Pimpinan Pesantren</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Pengawasan & Audit
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                ✓ Dapat Melakukan:
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li>Monitoring realtime KPI arus kas</li>
                <li>Melihat seluruh posisi saldo kas bank</li>
                <li>Audit rincian pengeluaran pesantren</li>
                <li>Unduh dan cetak berkas laporan resmi</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                ✕ Batasan Akses:
              </span>
              <ul className="space-y-1 text-slate-500 list-disc list-inside">
                <li>Tidak dapat membuat transaksi kas keluar</li>
                <li>Tidak dapat memodifikasi data santri</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
