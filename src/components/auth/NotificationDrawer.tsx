import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  CreditCard,
  AlertTriangle,
  Info,
  KeyRound,
  Upload,
  Clock,
  X,
  CheckCircle2,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const getIcon = (type: string, title: string) => {
    if (title.toLowerCase().includes('password') || title.toLowerCase().includes('reset')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
          <KeyRound className="w-4 h-4" />
        </div>
      );
    }
    if (title.toLowerCase().includes('import')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
          <Upload className="w-4 h-4" />
        </div>
      );
    }
    if (type === 'payment') {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
          <CreditCard className="w-4 h-4" />
        </div>
      );
    }
    if (type === 'warning') {
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200">
        <Info className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm sm:max-w-md h-full shadow-2xl border-l border-[#E2E8F0] flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Pusat Notifikasi
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  {unreadCount} pemberitahuan baru
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

          {/* Tabs & Mark Read */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'all'
                    ? 'bg-white text-[#064E3B] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('unread')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'unread'
                    ? 'bg-white text-[#064E3B] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs text-[#064E3B] hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tandai Dibaca
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification?.(notif)}
              className={`p-4 hover:bg-slate-50 transition flex gap-3 cursor-pointer ${
                !notif.read ? 'bg-emerald-50/20' : ''
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {getIcon(notif.type, notif.title)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#1E293B] truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.description}
                </p>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="p-12 text-center my-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-[#1E293B]">
                Tidak Ada Notifikasi Baru
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Anda sudah melihat semua notifikasi sistem terkini.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-[#E2E8F0] text-center text-xs text-slate-400">
          Log transaksi & notifikasi disinkronkan secara real-time
        </div>
      </div>
    </div>
  );
};
