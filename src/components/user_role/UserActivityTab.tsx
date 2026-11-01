import React, { useState } from 'react';
import {
  Search,
  Filter,
  History,
  Calendar,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Clock,
  Laptop,
  Download,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { UserActivityLog, UserRoleType } from '../../types';

interface UserActivityTabProps {
  activities: UserActivityLog[];
  onSelectActivity: (activity: UserActivityLog) => void;
  initialUserFilter?: string;
}

export const UserActivityTab: React.FC<UserActivityTabProps> = ({
  activities,
  onSelectActivity,
  initialUserFilter = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<string>(initialUserFilter);
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('01 Agu 2026 - 02 Sep 2026');

  const filteredLogs = activities.filter((act) => {
    const matchSearch =
      act.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.relatedDataRef && act.relatedDataRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.notes && act.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchUser = userFilter === 'all' || act.userName.includes(userFilter) || act.userId === userFilter;
    const matchType = activityTypeFilter === 'all' || act.activityType === activityTypeFilter;
    const matchModule = moduleFilter === 'all' || act.module === moduleFilter;

    return matchSearch && matchUser && matchType && matchModule;
  });

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'LOGIN':
      case 'LOGOUT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">AUTH</span>;
      case 'CREATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">TAMBAH</span>;
      case 'EDIT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">UBAH</span>;
      case 'IMPORT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">IMPORT</span>;
      case 'GENERATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">GENERATE</span>;
      case 'EXPORT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">EXPORT</span>;
      case 'CANCEL':
      case 'DELETE_ATTEMPT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">BATAL/HAPUS</span>;
      case 'ROLE_CHANGE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">ROLE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">AKSI</span>;
    }
  };

  const getStatusBadge = (status: 'BERHASIL' | 'GAGAL' | 'DITOLAK') => {
    switch (status) {
      case 'BERHASIL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            BERHASIL
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            DITOLAK
          </span>
        );
      case 'GAGAL':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            GAGAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-700" />
            Aktivitas Pengguna & Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak setiap aksi pencatatan, pengubahan, penerbitan tagihan, dan mutasi keuangan per pengguna.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{dateRange}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari aktivitas, user, ref..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        {/* Multi-Filters */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
            <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter:
          </div>

          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 shrink-0"
          >
            <option value="all">Semua Pengguna</option>
            <option value="Ahmad Fauzi">Ahmad Fauzi (Admin)</option>
            <option value="Bendahara 1">Bendahara 1 (Siti)</option>
            <option value="Bendahara 2">Bendahara 2 (Nurul)</option>
            <option value="Bendahara 3">Bendahara 3 (Hendra)</option>
            <option value="Pimpinan">Pimpinan Pesantren</option>
          </select>

          <select
            value={activityTypeFilter}
            onChange={(e) => setActivityTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 shrink-0"
          >
            <option value="all">Semua Jenis Aksi</option>
            <option value="LOGIN">Login / Masuk</option>
            <option value="CREATE">Tambah Transaksi</option>
            <option value="EDIT">Ubah / Koreksi</option>
            <option value="IMPORT">Import Pembayaran</option>
            <option value="GENERATE">Generate Tagihan</option>
            <option value="EXPORT">Export Laporan</option>
            <option value="CANCEL">Pembatalan</option>
            <option value="ROLE_CHANGE">Perubahan Role</option>
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 shrink-0"
          >
            <option value="all">Semua Modul</option>
            <option value="Authentication">Authentication</option>
            <option value="Pengeluaran">Pengeluaran</option>
            <option value="Pembayaran">Pembayaran</option>
            <option value="Tagihan">Tagihan</option>
            <option value="Rekening Bank">Rekening Bank</option>
            <option value="Pusat Laporan">Pusat Laporan</option>
            <option value="User & Role">User & Role</option>
          </select>

          {(searchTerm || userFilter !== 'all' || activityTypeFilter !== 'all' || moduleFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setUserFilter('all');
                setActivityTypeFilter('all');
                setModuleFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Waktu Transaksi</th>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Aktivitas</th>
                <th className="py-3.5 px-4">Modul</th>
                <th className="py-3.5 px-4">Data Terkait</th>
                <th className="py-3.5 px-4">Perangkat / IP</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-20">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => onSelectActivity(log)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Waktu */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>

                    {/* Pengguna */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {log.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-emerald-800 transition-colors block">
                            {log.userName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {log.userRole}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Aktivitas */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getActivityBadge(log.activityType)}
                        <span className="font-medium text-slate-800">{log.activityName}</span>
                      </div>
                      {log.dataChanges && log.dataChanges.length > 0 && (
                        <span className="inline-block text-[10px] font-semibold text-amber-700 mt-0.5">
                          • Terdapat perubahan nilai ({log.dataChanges.length} kolom)
                        </span>
                      )}
                    </td>

                    {/* Modul */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {log.module}
                      </span>
                    </td>

                    {/* Data Ref */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] text-slate-600">
                        {log.relatedDataRef || '-'}
                      </span>
                    </td>

                    {/* Device / IP */}
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="text-[11px] leading-tight">
                        <span className="text-slate-700 font-medium block truncate max-w-[140px]">
                          {log.device}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{log.ipAddress}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(log.status)}</td>

                    {/* Aksi / Detail */}
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectActivity(log);
                      }}
                    >
                      <button className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-slate-700">Tidak Ada Log Aktivitas Ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Coba sesuaikan kata kunci pencarian atau reset filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong>{filteredLogs.length}</strong> catatan aktivitas audit
          </span>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-[11px]">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Audit trail tersimpan permanen & tidak dapat dimanipulasi
          </div>
        </div>
      </div>
    </div>
  );
};
