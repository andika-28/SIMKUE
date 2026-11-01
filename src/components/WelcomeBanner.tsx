import React from 'react';
import { Calendar, Moon, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';
import { CurrentAuthUser } from '../types';

interface WelcomeBannerProps {
  currentUser?: CurrentAuthUser | null;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ currentUser }) => {
  const userName = currentUser?.name || 'Administrator';
  const userRole = currentUser?.role || 'Administrator';

  const getSubtext = () => {
    if (userRole === 'Pimpinan') {
      return 'Laporan eksekutif dan ringkasan fiskal PM. Raudhatussalam Mahato siap ditinjau.';
    }
    if (userRole === 'Bendahara') {
      return 'Operasional kasir, penerimaan SPP, dan pembukuan harian pesantren siap dikelola.';
    }
    return 'Berikut ringkasan kondisi keuangan dan kontrol sistem PM. Raudhatussalam Mahato hari ini.';
  };

  return (
    <section
      id="welcome-section"
      className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#1E293B] tracking-tight">
            Assalamu'alaikum, {userName} 👋
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Role: {userRole}
          </span>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          {getSubtext()}
        </p>
      </div>

      {/* Date & Hijri Calendar Badge on Right */}
      <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end">
        <div className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-lg flex items-center gap-2.5 text-xs text-[#334155] shadow-xs">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-[#064E3B] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-[#1E293B] block leading-tight">
              Senin, 31 Agustus 2026
            </span>
            <span className="text-[10px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5">
              <Moon className="w-2.5 h-2.5 text-[#064E3B]" /> 18 Safar 1448 H
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

