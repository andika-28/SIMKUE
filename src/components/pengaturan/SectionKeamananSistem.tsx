import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  History,
  Download,
  Database,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  RotateCw,
} from 'lucide-react';
import { ConfigAuditHistoryItem } from '../../types';

interface SectionKeamananSistemProps {
  auditLogs: ConfigAuditHistoryItem[];
  onShowToast: (msg: string) => void;
}

export const SectionKeamananSistem: React.FC<SectionKeamananSistemProps> = ({
  auditLogs,
  onShowToast,
}) => {
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [passwordExpiryDays, setPasswordExpiryDays] = useState('90');
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleDownloadBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      onShowToast('Snapshot database SIMKEU berhasil diunduh (simkeu-backup-2026-09-02.json).');
    }, 800);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Kebijakan keamanan sistem berhasil diperbarui.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Keamanan Sistem & Audit Trail</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Parameter sesi akses, enkripsi data, jadwal pencadangan otomatis, dan log rekam jejak audit administrator.
        </p>
      </div>

      {/* Security Policies Form */}
      <form onSubmit={handleSaveSecurity} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Kebijakan Sesi & Autentikasi
          </h3>
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            Simpan Parameter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Batas Waktu Sesi (Inactivity)</label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold"
            >
              <option value="30">30 Menit</option>
              <option value="60">60 Menit (Direkomendasikan)</option>
              <option value="120">120 Menit (2 Jam)</option>
              <option value="240">240 Menit (4 Jam)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Masa Berlaku Kata Sandi</label>
            <select
              value={passwordExpiryDays}
              onChange={(e) => setPasswordExpiryDays(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold"
            >
              <option value="30">Setiap 30 Hari</option>
              <option value="90">Setiap 90 Hari (Standar)</option>
              <option value="180">Setiap 180 Hari</option>
              <option value="0">Tidak Pernah Kedaluwarsa</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Autentikasi 2 Langkah (2FA)</label>
            <select
              value={enforce2FA ? 'yes' : 'no'}
              onChange={(e) => setEnforce2FA(e.target.value === 'yes')}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold"
            >
              <option value="yes">Wajib untuk Super Admin & Pimpinan</option>
              <option value="no">Opsional</option>
            </select>
          </div>
        </div>
      </form>

      {/* Database Backup & Disaster Recovery */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pencadangan Basis Data (Backup & Recovery)
              </h3>
              <p className="text-[11px] text-slate-500">
                Perlindungan data transaksi dan arsip keuangan santri
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Auto-Backup Harian (02:00 WIB)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 block">Snapshot Terakhir Tersedia:</span>
            <p className="text-[11px] text-slate-500">
              02 September 2026, 02:00:15 WIB • Ukuran: 14.8 MB (Enkripsi AES-256)
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadBackup}
            disabled={isBackingUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-xs hover:shadow-sm transition-all shrink-0"
          >
            {isBackingUp ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                Menyiapkan File...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Unduh Snapshot Database
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit Trail Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Perubahan Konfigurasi Sistem (Audit Trail)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            10 Aktivitas Terakhir
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Waktu (WIB)</th>
                <th className="px-4 py-3">Pengguna & Peran</th>
                <th className="px-4 py-3">Modul / Bagian</th>
                <th className="px-4 py-3">Aksi & Rincian Perubahan</th>
                <th className="px-5 py-3 text-right">Alamat IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-600">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {log.userName}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] border border-slate-200">
                      {log.section}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    <span className="font-semibold text-emerald-900">{log.action}: </span>
                    <span className="text-slate-600 text-[11px]">{log.details}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-[10px] text-slate-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
