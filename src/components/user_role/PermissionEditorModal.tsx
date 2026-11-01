import React, { useState } from 'react';
import {
  X,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
  Save,
  CheckSquare,
  Square,
  AlertCircle,
  Sparkles,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  CreditCard,
  ArrowDownRight,
  Landmark,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { UserRoleType, PermissionGroup } from '../../types';
import { permissionEditorGroups } from '../../data/userData';

interface PermissionEditorModalProps {
  role: UserRoleType;
  isOpen: boolean;
  onClose: () => void;
  onSavePermissions: (role: UserRoleType, updatedPermissions: string[]) => void;
}

export const PermissionEditorModal: React.FC<PermissionEditorModalProps> = ({
  role,
  isOpen,
  onClose,
  onSavePermissions,
}) => {
  // Initialize checked permissions based on role
  const [activePermissions, setActivePermissions] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    permissionEditorGroups.forEach((grp) => {
      grp.items.forEach((item) => {
        map[item.id] = item.defaultRoles.includes(role);
      });
    });
    return map;
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'grp-dashboard': true,
    'grp-santri': true,
    'grp-tagihan': true,
    'grp-pembayaran': true,
    'grp-pengeluaran': true,
    'grp-rekening': true,
    'grp-laporan': true,
    'grp-system': true,
  });

  if (!isOpen) return null;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const togglePermission = (permId: string) => {
    setActivePermissions((prev) => ({ ...prev, [permId]: !prev[permId] }));
  };

  const toggleAllInGroup = (group: PermissionGroup, enable: boolean) => {
    setActivePermissions((prev) => {
      const updated = { ...prev };
      group.items.forEach((item) => {
        updated[item.id] = enable;
      });
      return updated;
    });
  };

  const getGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className="h-4 w-4 text-emerald-700" />;
      case 'Users': return <Users className="h-4 w-4 text-emerald-700" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="h-4 w-4 text-emerald-700" />;
      case 'CreditCard': return <CreditCard className="h-4 w-4 text-emerald-700" />;
      case 'ArrowDownRight': return <ArrowDownRight className="h-4 w-4 text-emerald-700" />;
      case 'Landmark': return <Landmark className="h-4 w-4 text-emerald-700" />;
      case 'FileText': return <FileText className="h-4 w-4 text-emerald-700" />;
      case 'ShieldCheck': return <ShieldCheck className="h-4 w-4 text-emerald-700" />;
      default: return <Shield className="h-4 w-4 text-emerald-700" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'VIEW':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">VIEW</span>;
      case 'CREATE':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">CREATE</span>;
      case 'EDIT':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">EDIT</span>;
      case 'CANCEL':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">CANCEL</span>;
      case 'EXPORT':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">EXPORT</span>;
      case 'MANAGE':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">MANAGE</span>;
      case 'APPROVE':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">APPROVE</span>;
      default:
        return null;
    }
  };

  const handleSave = () => {
    const activeList = Object.keys(activePermissions).filter((k) => activePermissions[k]);
    onSavePermissions(role, activeList);
    onClose();
  };

  const totalPermissions = Object.keys(activePermissions).length;
  const grantedCount = Object.values(activePermissions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-800">
                Konfigurasi Hak Akses — <span className="text-emerald-700">{role}</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {grantedCount} dari {totalPermissions} Izin Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Atur hak akses terperinci untuk role <strong>{role}</strong> di seluruh modul SIMKEU.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Groups */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {permissionEditorGroups.map((group) => {
            const isExpanded = expandedGroups[group.id] ?? true;
            const groupGrantedCount = group.items.filter((item) => activePermissions[item.id]).length;
            const allChecked = groupGrantedCount === group.items.length;
            const someChecked = groupGrantedCount > 0 && !allChecked;

            return (
              <div
                key={group.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                {/* Group Header */}
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div
                    className="flex items-center gap-2.5 cursor-pointer select-none min-w-0"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {getGroupIcon(group.iconName)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{group.name}</h4>
                      <p className="text-[11px] text-slate-500">{group.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {groupGrantedCount} / {group.items.length} Aktif
                    </span>

                    {/* Quick check/uncheck group */}
                    <button
                      type="button"
                      onClick={() => toggleAllInGroup(group, !allChecked)}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-0.5 rounded hover:bg-emerald-50 transition-colors"
                    >
                      {allChecked ? 'Batal Semua' : 'Pilih Semua'}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Group Items Accordion */}
                {isExpanded && (
                  <div className="p-3 divide-y divide-slate-100">
                    {group.items.map((item) => {
                      const isChecked = !!activePermissions[item.id];
                      return (
                        <label
                          key={item.id}
                          className="flex items-start justify-between p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePermission(item.id)}
                              className="mt-1 rounded text-emerald-700 focus:ring-emerald-600"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isChecked ? 'text-slate-800' : 'text-slate-500'}`}>
                                  {item.label}
                                </span>
                                {getTypeBadge(item.type)}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-slate-400 mt-1 shrink-0 ml-2">
                            {item.code}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Perubahan hak akses berlaku langsung pada sesi login berikutnya.
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043d2e] rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              Simpan Perubahan Hak Akses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
