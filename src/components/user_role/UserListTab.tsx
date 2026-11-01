import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  KeyRound,
  UserX,
  MoreVertical,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { AppUser, UserRoleType, UserStatusType } from '../../types';

interface UserListTabProps {
  users: AppUser[];
  onAddUser: () => void;
  onViewDetail: (user: AppUser) => void;
  onEditUser: (user: AppUser) => void;
  onResetPassword: (user: AppUser) => void;
  onDeactivateUser: (user: AppUser) => void;
}

export const UserListTab: React.FC<UserListTabProps> = ({
  users,
  onAddUser,
  onViewDetail,
  onEditUser,
  onResetPassword,
  onDeactivateUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  const getRoleBadge = (role: UserRoleType) => {
    switch (role) {
      case 'Administrator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="h-3 w-3" />
            Administrator
          </span>
        );
      case 'Bendahara':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Shield className="h-3 w-3" />
            Bendahara
          </span>
        );
      case 'Pimpinan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Eye className="h-3 w-3" />
            Pimpinan
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: UserStatusType) => {
    switch (status) {
      case 'Aktif':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Aktif
          </span>
        );
      case 'Nonaktif':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Nonaktif
          </span>
        );
      case 'Ditangguhkan':
      case 'Terkunci':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-700" />
            Daftar Pengguna Sistem
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola pengguna yang memiliki akses login dan hak operasi ke SIMKEU PM. Raudhatussalam Mahato.
          </p>
        </div>
        <button
          onClick={onAddUser}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#043d2e] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau username..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter:
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="all">Semua Role</option>
            <option value="Administrator">Administrator</option>
            <option value="Bendahara">Bendahara</option>
            <option value="Pimpinan">Pimpinan</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
            <option value="Ditangguhkan">Ditangguhkan</option>
          </select>

          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors shrink-0"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Username</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Terakhir Login</th>
                <th className="py-3.5 px-4">Aktivitas Terakhir</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => onViewDetail(user)}
                  >
                    {/* No */}
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>

                    {/* Pengguna (Avatar + Name + Title) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl ${user.avatarColor} flex items-center justify-center font-bold text-xs shadow-2xs shrink-0`}
                        >
                          {user.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                            {user.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{user.title}</p>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                        @{user.username}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(user.status)}</td>

                    {/* Terakhir Login */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{user.lastLogin}</span>
                      </div>
                    </td>

                    {/* Aktivitas Terakhir */}
                    <td className="py-3.5 px-4">
                      <div className="max-w-[220px]">
                        <p className="text-xs font-medium text-slate-800 truncate">
                          {user.lastActivity}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Modul: {user.lastActivityModule}
                        </p>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Lihat Detail"
                          onClick={() => onViewDetail(user)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          title="Edit Pengguna"
                          onClick={() => onEditUser(user)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          title="Reset Password"
                          onClick={() => onResetPassword(user)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          title={user.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          onClick={() => onDeactivateUser(user)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === 'Aktif'
                              ? 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                              : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Belum Ada Pengguna Ditemukan</h4>
                      <p className="text-xs text-slate-500 text-center">
                        Tidak ada pengguna yang cocok dengan kriteria filter atau pencarian Anda.
                      </p>
                      <button
                        onClick={onAddUser}
                        className="px-4 py-2 bg-[#064E3B] text-white text-xs font-bold rounded-lg hover:bg-[#043d2e] transition-colors flex items-center gap-1.5 mt-2"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Tambah Pengguna Baru
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong>{filteredUsers.length}</strong> dari <strong>{users.length}</strong> total pengguna
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {users.filter((u) => u.status === 'Aktif').length} Aktif
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              {users.filter((u) => u.status === 'Nonaktif').length} Nonaktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
