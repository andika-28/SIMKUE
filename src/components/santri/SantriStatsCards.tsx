import React from 'react';
import { Users, UserCheck, GraduationCap, School, Trophy, Award } from 'lucide-react';
import { StudentStatsSummary } from '../../types';

interface SantriStatsCardsProps {
  stats: StudentStatsSummary;
  onFilterUnit?: (unit: string) => void;
  onFilterStatus?: (status: string) => void;
  onFilterBeasiswa?: (beasiswa: string) => void;
}

export const SantriStatsCards: React.FC<SantriStatsCardsProps> = ({
  stats,
  onFilterUnit,
  onFilterStatus,
  onFilterBeasiswa,
}) => {
  return (
    <section id="santri-stats-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* CARD 1: Total Santri */}
      <div
        id="card-total-santri"
        onClick={() => {
          onFilterStatus?.('ALL');
          onFilterUnit?.('ALL');
          onFilterBeasiswa?.('ALL');
        }}
        className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs hover:border-[#064E3B]/30 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            Total Santri
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
            {stats.totalSantri}
          </h3>
          <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
            Santri Terdaftar
          </p>
        </div>
      </div>

      {/* CARD 2: Santri Aktif */}
      <div
        id="card-santri-aktif"
        onClick={() => {
          onFilterStatus?.('Aktif');
          onFilterUnit?.('ALL');
        }}
        className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            Santri Aktif
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#064E3B] border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B] animate-pulse" />
            <span className="text-[10px] font-bold">98.6%</span>
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
            {stats.santriAktif}
          </h3>
          <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
            Sedang Aktif
          </p>
        </div>
      </div>

      {/* CARD 3: Santri MTs */}
      <div
        id="card-santri-mts"
        onClick={() => onFilterUnit?.('MTs')}
        className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs hover:border-[#064E3B]/30 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            Santri MTs
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
            {stats.santriMTs}
          </h3>
          <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
            Kelas 1 – 3
          </p>
        </div>
      </div>

      {/* CARD 4: Santri MA */}
      <div
        id="card-santri-ma"
        onClick={() => onFilterUnit?.('MA')}
        className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs hover:border-[#064E3B]/30 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            Santri MA
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
            <School className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
            {stats.santriMA}
          </h3>
          <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
            Kelas 4 – 6
          </p>
        </div>
      </div>

      {/* CARD 5: Beasiswa & Potongan SPP */}
      <div
        id="card-santri-beasiswa"
        onClick={() => onFilterBeasiswa?.('Beasiswa Prestasi (100%)')}
        className="bg-purple-50/40 rounded-xl p-4 border border-purple-200 shadow-xs hover:border-purple-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-purple-900 uppercase tracking-wider">
            Beasiswa SPP
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-extrabold text-purple-900 tracking-tight">
            {stats.totalPenerimaBeasiswa || 24}
          </h3>
          <p className="text-[11px] font-medium text-purple-700 mt-0.5 flex items-center gap-1">
            <span>{stats.beasiswaPrestasiCount || 14} Santri Prestasi</span>
          </p>
        </div>
      </div>
    </section>
  );
};
