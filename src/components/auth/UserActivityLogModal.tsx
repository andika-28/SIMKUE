import React, { useState } from 'react';
import {
  History,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  Globe,
  Filter,
  Search,
} from 'lucide-react';
import { AuthAuditLogRecord } from '../../types';
import { initialAuthAuditLogs } from '../../data/authData';

interface UserActivityLogModalProps {
  onClose: () => void;
  logs?: AuthAuditLogRecord[];
}

export const UserActivityLogModal: React.FC<UserActivityLogModalProps> = ({
  onClose,
  logs = initialAuthAuditLogs,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'ALL' && log.eventType !== filterType) return false;
    if (
      search &&
      !log.username.toLowerCase().includes(search.toLowerCase()) &&
      !log.name.toLowerCase().includes(search.toLowerCase()) &&
      !log.details.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getEventBadge = (type: AuthAuditLogRecord['eventType']) => {
    switch (type) {
      case 'LOGIN SUCCESS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'LOGIN FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ACCOUNT LOCKED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'SESSION TIMEOUT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PASSWORD RESET':
      case 'PASSWORD CHANGED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOGOUT':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-7 text-left my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B]">
                Audit Log & Aktivitas Autentikasi
              </h3>
              <p className="text-xs text-[#64748B]">
                Rekam jejak login, perubahan hak akses, dan kepatuhan keamanan SIMKEU.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari user, IP, atau keterangan log..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-[#064E3B] outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 outline-none focus:border-[#064E3B]"
          >
            <option value="ALL">Semua Aktivitas</option>
            <option value="LOGIN SUCCESS">Login Berhasil</option>
            <option value="LOGIN FAILED">Login Gagal</option>
            <option value="ACCOUNT LOCKED">Akun Terkunci</option>
            <option value="PASSWORD RESET">Reset Password</option>
            <option value="SESSION TIMEOUT">Sesi Berakhir</option>
            <option value="LOGOUT">Logout</option>
          </select>
        </div>

        {/* Log List */}
        <div className="mt-4 flex-1 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-3.5 hover:bg-slate-50 transition text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getEventBadge(log.eventType)}`}>
                    {log.eventType}
                  </span>
                  <span className="font-bold text-slate-800">{log.name}</span>
                  <span className="text-slate-400">({log.username})</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {log.details}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    IP: {log.ipAddress}
                  </span>
                  <span className="flex items-center gap-1">
                    <Laptop className="w-3 h-3" />
                    {log.browser}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada riwayat aktivitas yang cocok dengan filter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredLogs.length} entri log keamanan terenkripsi</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#064E3B] text-white font-bold hover:bg-[#047857] transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
