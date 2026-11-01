import React from 'react';
import { PieChart, Utensils, GraduationCap, Trophy, Award, BookOpen, HeartHandshake } from 'lucide-react';
import { StudentStatsSummary } from '../../types';

interface SantriDistributionInsightProps {
  stats: StudentStatsSummary;
}

export const SantriDistributionInsight: React.FC<SantriDistributionInsightProps> = ({ stats }) => {
  const mtsPercent = Math.round((stats.santriMTs / (stats.totalSantri || 1)) * 100);
  const maPercent = Math.round((stats.santriMA / (stats.totalSantri || 1)) * 100);

  const paketAPercent = Math.round((stats.paketACount / (stats.totalSantri || 1)) * 100);
  const paketBPercent = Math.round((stats.paketBCount / (stats.totalSantri || 1)) * 100);
  const paketCPercent = Math.round((stats.paketCCount / (stats.totalSantri || 1)) * 100);

  const beasiswaPrestasi = stats.beasiswaPrestasiCount || 14;
  const totalBeasiswa = stats.totalPenerimaBeasiswa || 24;

  return (
    <div
      id="santri-distribution-insight"
      className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E293B]">
              Distribusi Santri, Paket Makan & Program Beasiswa
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Komposisi jenjang pendidikan, katering makan, dan alokasi potongan SPP prestasi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 flex items-center gap-1">
            <Trophy className="w-3 h-3 text-purple-600" />
            {totalBeasiswa} Penerima Beasiswa
          </span>
          <span className="text-[11px] font-semibold text-[#064E3B] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Total 300 Santri
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Col 1: Unit Distribution */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1E293B] flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              Jenjang Pendidikan (Unit)
            </span>
            <span className="text-[#64748B] text-[11px]">Kelas 1 – 6</span>
          </div>

          {/* MTs Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#334155]">MTs (Kelas 1–3)</span>
              <span className="font-bold text-[#1E293B]">
                {stats.santriMTs} Santri{' '}
                <span className="text-[#64748B] font-normal">({mtsPercent}%)</span>
              </span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${mtsPercent}%` }}
              />
            </div>
          </div>

          {/* MA Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#334155]">MA (Kelas 4–6)</span>
              <span className="font-bold text-[#1E293B]">
                {stats.santriMA} Santri{' '}
                <span className="text-[#64748B] font-normal">({maPercent}%)</span>
              </span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${maPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Col 2: Meal Package Distribution */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1E293B] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#064E3B]" />
              Pilihan Paket Makan
            </span>
            <span className="text-[#64748B] text-[11px]">Konsumsi Pesantren</span>
          </div>

          {/* Paket C: Full pesantren */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#334155]">
                Paket C <span className="text-[10px] text-[#64748B]">(Rp600rb)</span>
              </span>
              <span className="font-bold text-[#064E3B]">
                {stats.paketCCount} Santri <span className="text-[#64748B] font-normal">({paketCPercent}%)</span>
              </span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#064E3B] h-full rounded-full transition-all duration-500"
                style={{ width: `${paketCPercent}%` }}
              />
            </div>
          </div>

          {/* Paket B: 2x rumah */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#334155]">
                Paket B <span className="text-[10px] text-[#64748B]">(Rp200rb)</span>
              </span>
              <span className="font-bold text-amber-800">
                {stats.paketBCount} Santri <span className="text-[#64748B] font-normal">({paketBPercent}%)</span>
              </span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${paketBPercent}%` }}
              />
            </div>
          </div>

          {/* Paket A: Full rumah */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#334155]">
                Paket A <span className="text-[10px] text-[#64748B]">(Rp0)</span>
              </span>
              <span className="font-bold text-slate-700">
                {stats.paketACount} Santri <span className="text-[#64748B] font-normal">({paketAPercent}%)</span>
              </span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className="bg-slate-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${paketAPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Col 3: Beasiswa & Potongan SPP */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-900 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              Program Beasiswa & Potongan SPP
            </span>
            <span className="text-purple-700 font-semibold text-[11px] font-mono">
              Subsidi Rp11.0 Jt/bln
            </span>
          </div>

          <div className="space-y-2">
            {/* Beasiswa Prestasi */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/70 border border-purple-100">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-purple-700" />
                <span className="font-medium text-[#334155] text-[11px]">
                  Beasiswa Prestasi (100% & 50%)
                </span>
              </div>
              <span className="font-bold text-purple-950 font-mono text-xs">
                {beasiswaPrestasi} Santri
              </span>
            </div>

            {/* Beasiswa Tahfidz */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-medium text-[#334155] text-[11px]">
                  Beasiswa Tahfidz Mutqin
                </span>
              </div>
              <span className="font-bold text-emerald-950 font-mono text-xs">
                6 Santri
              </span>
            </div>

            {/* Beasiswa Yatim / Dhuafa */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                <span className="font-medium text-[#334155] text-[11px]">
                  Subsidi Yatim & Dhuafa
                </span>
              </div>
              <span className="font-bold text-amber-950 font-mono text-xs">
                4 Santri
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
