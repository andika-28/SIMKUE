import React from 'react';
import {
  X,
  History,
  Shield,
  User,
  Clock,
  Laptop,
  Globe,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { UserActivityLog } from '../../types';

interface ActivityDetailDrawerProps {
  activity: UserActivityLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityDetailDrawer: React.FC<ActivityDetailDrawerProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !activity) return null;

  const isSuccess = activity.status === 'BERHASIL';
  const isRejected = activity.status === 'DITOLAK';

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <History className="h-5 w-5 text-emerald-700" />
            Detail Rekam Jejak Audit
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Action Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nama Aktivitas
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isSuccess
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : isRejected
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                {activity.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800">{activity.activityName}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-700">{activity.module}</span>
              <span>•</span>
              <span className="font-mono text-slate-600">{activity.id}</span>
            </div>
          </div>

          {/* User & Role */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Identitas Pengguna
            </h4>
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{activity.userName}</h4>
                  <p className="text-[11px] text-slate-500">Role: {activity.userRole}</p>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-400">ID: {activity.userId}</span>
            </div>
          </div>

          {/* Timestamp & Location Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Waktu & Telemetri Akses
            </h4>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Waktu Transaksi
                </span>
                <span className="font-semibold text-slate-800">{activity.timestamp}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Laptop className="h-3.5 w-3.5 text-slate-400" /> Perangkat (Device)
                </span>
                <span className="font-medium text-slate-800">{activity.device}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-slate-400" /> Browser
                </span>
                <span className="font-medium text-slate-800">{activity.browser}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-slate-400" /> Alamat IP
                </span>
                <span className="font-mono font-medium text-slate-800">{activity.ipAddress}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> Lokasi Terdeteksi
                </span>
                <span className="font-medium text-slate-800">{activity.location}</span>
              </div>
            </div>
          </div>

          {/* Related Data / ID */}
          {activity.relatedDataRef && activity.relatedDataRef !== '-' && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Data / Dokumen Terkait
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Nomor Dokumen / Invoice:</span>
                <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {activity.relatedDataRef}
                </span>
              </div>
            </div>
          )}

          {/* Data Change Audit (Before vs After) */}
          {activity.dataChanges && activity.dataChanges.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-emerald-700" />
                Audit Perubahan Data (Data Change Diff)
              </h4>
              <div className="space-y-3">
                {activity.dataChanges.map((change, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>Kolom: {change.field}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-amber-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                          Data Sebelum
                        </span>
                        <span className="text-xs font-mono text-slate-700 block mt-0.5 line-through">
                          {change.before}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                          Data Sesudah
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-800 block mt-0.5">
                          {change.after}
                        </span>
                      </div>
                    </div>

                    {change.reason && (
                      <div className="text-[11px] text-amber-900 bg-amber-100/50 p-2 rounded border border-amber-200/60">
                        <strong>Alasan Perubahan:</strong> {change.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes / Description */}
          {activity.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Catatan Transaksi & Sistem
              </h4>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {activity.notes}
              </div>
            </div>
          )}

          {/* Audit Verification Stamp */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
            <div className="text-[11px] leading-tight">
              <strong>Audit Trail Terverifikasi:</strong> Catatan transaksi ini tercatat secara otomatis oleh sistem integritas SIMKEU PM. Raudhatussalam Mahato.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};
